const { query } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Mock YooKassa client (in production, use actual SDK)
const createYooKassaPayment = async (amount, description, metadata) => {
  // In production, integrate with actual YooKassa API
  // https://yookassa.ru/developers/api
  
  const paymentId = `payment_${uuidv4()}`;
  
  return {
    id: paymentId,
    status: 'pending',
    amount: { value: amount.toString(), currency: 'RUB' },
    description,
    metadata,
    confirmation: {
      type: 'redirect',
      confirmation_url: `https://yookassa.ru/mock/payment/${paymentId}`,
    },
    created_at: new Date().toISOString(),
  };
};

// Create payment for promotion
const createPayment = async (req, res, next) => {
  try {
    const { promotionId, method = 'bank_card' } = req.body;

    // Get promotion details
    const promotion = await query(
      'SELECT * FROM promotions WHERE id = $1 AND user_id = $2',
      [promotionId, req.user.id]
    );

    if (promotion.rows.length === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    const promo = promotion.rows[0];

    if (promo.status !== 'pending') {
      return res.status(400).json({ error: 'Promotion already paid or cancelled' });
    }

    // Create YooKassa payment
    const paymentData = await createYooKassaPayment(
      promo.price,
      `Оплата продвижения объявления: ${promo.type}`,
      { promotionId: promo.id, userId: req.user.id, type: 'promotion' }
    );

    // Create transaction record
    const transaction = await query(`
      INSERT INTO transactions (
        user_id, amount, currency, type, status, payment_method,
        yookassa_payment_id, description, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      req.user.id,
      promo.price,
      'RUB',
      'promotion',
      'pending',
      method,
      paymentData.id,
      `Promotion: ${promo.type}`,
      JSON.stringify({ promotionId: promo.id }),
    ]);

    res.json({
      payment: {
        id: paymentData.id,
        amount: promo.price,
        currency: 'RUB',
        confirmationUrl: paymentData.confirmation.confirmation_url,
        method,
      },
      transaction: transaction.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Handle payment notification (webhook from YooKassa)
const paymentNotification = async (req, res, next) => {
  try {
    const { event, object } = req.body;

    // Verify webhook signature in production
    // YooKassa sends HMAC-SHA256 signature

    if (event === 'payment.succeeded') {
      const paymentId = object.id;
      const amount = parseFloat(object.amount.value);
      const metadata = object.metadata;

      // Update transaction
      await query(`
        UPDATE transactions 
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP
        WHERE yookassa_payment_id = $1
      `, [paymentId]);

      // Activate promotion if metadata contains promotionId
      if (metadata.promotionId) {
        await query(
          "UPDATE promotions SET status = 'active', payment_id = $1 WHERE id = $2",
          [paymentId, metadata.promotionId]
        );

        // Update listing based on promotion type
        const promo = await query('SELECT type, listing_id FROM promotions WHERE id = $1', [metadata.promotionId]);
        if (promo.rows.length > 0) {
          const { type, listing_id } = promo.rows[0];
          let updateQuery = '';
          
          switch (type) {
            case 'boost':
              updateQuery = 'UPDATE listings SET is_featured = TRUE WHERE id = $1';
              break;
            case 'highlight':
              updateQuery = "UPDATE listings SET highlight_color = '#FFD700' WHERE id = $1";
              break;
            case 'top':
              updateQuery = 'UPDATE listings SET is_top = TRUE WHERE id = $1';
              break;
            case 'recommended':
              updateQuery = 'UPDATE listings SET is_recommended = TRUE WHERE id = $1';
              break;
          }

          await query(updateQuery, [listing_id]);
        }
      }
    } else if (event === 'payment.canceled') {
      const paymentId = object.id;

      await query(`
        UPDATE transactions SET status = 'failed'
        WHERE yookassa_payment_id = $1
      `, [paymentId]);

      await query(`
        UPDATE promotions SET status = 'cancelled'
        WHERE payment_id = $1
      `, [paymentId]);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
};

// Get user's transactions
const getTransactions = async (req, res, next) => {
  try {
    const { type, status } = req.query;

    const conditions = ['user_id = $1'];
    const values = [req.user.id];
    let paramIndex = 2;

    if (type) {
      conditions.push(`type = $${paramIndex}`);
      values.push(type);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    const result = await query(`
      SELECT * FROM transactions
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT 50
    `, values);

    res.json({ transactions: result.rows });
  } catch (error) {
    next(error);
  }
};

// Get transaction by ID
const getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Create top-up transaction (add balance)
const createTopUp = async (req, res, next) => {
  try {
    const { amount, method = 'bank_card' } = req.body;

    if (amount < 100) {
      return res.status(400).json({ error: 'Minimum top-up amount is 100 RUB' });
    }

    // Create YooKassa payment
    const paymentData = await createYooKassaPayment(
      amount,
      'Пополнение баланса RealApp',
      { userId: req.user.id, type: 'topup' }
    );

    // Create transaction record
    const transaction = await query(`
      INSERT INTO transactions (
        user_id, amount, currency, type, status, payment_method,
        yookassa_payment_id, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      req.user.id,
      amount,
      'RUB',
      'topup',
      'pending',
      method,
      paymentData.id,
      'Balance top-up',
    ]);

    res.json({
      payment: {
        id: paymentData.id,
        amount,
        currency: 'RUB',
        confirmationUrl: paymentData.confirmation.confirmation_url,
        method,
      },
      transaction: transaction.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  paymentNotification,
  getTransactions,
  getTransaction,
  createTopUp,
};
