const { query } = require('../config/db');
const { validationResult } = require('express-validator');

// Promotion pricing
const PROMOTION_PRICES = {
  boost: 10,        // Поднять в поиске
  highlight: 10,    // Выделить цветом
  top: 20,          // Закрепить в топе
  recommended: 25,  // В рекомендуемые
};

// Create promotion
const createPromotion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { listingId, type, durationDays = 1 } = req.body;

    // Verify listing ownership
    const listing = await query(
      'SELECT user_id, status FROM listings WHERE id = $1',
      [listingId]
    );

    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to promote this listing' });
    }

    const price = PROMOTION_PRICES[type];
    if (!price) {
      return res.status(400).json({ error: 'Invalid promotion type' });
    }

    const totalPrice = price * durationDays;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // Create promotion (pending payment)
    const result = await query(`
      INSERT INTO promotions (listing_id, user_id, type, price, duration_days, end_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [listingId, req.user.id, type, totalPrice, durationDays, endDate]);

    res.status(201).json({
      promotion: result.rows[0],
      totalPrice,
      message: 'Promotion created. Please complete payment to activate.',
    });
  } catch (error) {
    next(error);
  }
};

// Get user's promotions
const getUserPromotions = async (req, res, next) => {
  try {
    const { status } = req.query;

    const conditions = ['user_id = $1'];
    const values = [req.user.id];

    if (status) {
      conditions.push('status = $2');
      values.push(status);
    }

    const result = await query(`
      SELECT 
        p.*,
        l.title as listing_title,
        l.address as listing_address,
        l.primary_photo
      FROM promotions p
      JOIN listings l ON p.listing_id = l.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY p.created_at DESC
    `, values);

    res.json({ promotions: result.rows });
  } catch (error) {
    next(error);
  }
};

// Activate promotion after payment
const activatePromotion = async (req, res, next) => {
  try {
    const { promotionId } = req.params;
    const { paymentId } = req.body;

    const promotion = await query(
      'SELECT * FROM promotions WHERE id = $1 AND user_id = $2',
      [promotionId, req.user.id]
    );

    if (promotion.rows.length === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    const promo = promotion.rows[0];

    if (promo.status !== 'pending') {
      return res.status(400).json({ error: 'Promotion already activated or cancelled' });
    }

    // Update promotion status
    await query(
      "UPDATE promotions SET status = 'active', payment_id = $1 WHERE id = $2",
      [paymentId, promotionId]
    );

    // Update listing based on promotion type
    let updateQuery = '';
    switch (promo.type) {
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

    await query(updateQuery, [promo.listing_id]);

    res.json({ message: 'Promotion activated successfully' });
  } catch (error) {
    next(error);
  }
};

// Expire promotions (cron job should call this)
const expirePromotions = async () => {
  try {
    // Get expired promotions
    const expired = await query(`
      SELECT * FROM promotions 
      WHERE status = 'active' AND end_date < CURRENT_TIMESTAMP
    `);

    for (const promo of expired.rows) {
      // Update promotion status
      await query(
        "UPDATE promotions SET status = 'expired' WHERE id = $1",
        [promo.id]
      );

      // Remove listing benefits
      let updateQuery = '';
      switch (promo.type) {
        case 'boost':
          updateQuery = 'UPDATE listings SET is_featured = FALSE WHERE id = $1';
          break;
        case 'highlight':
          updateQuery = 'UPDATE listings SET highlight_color = NULL WHERE id = $1';
          break;
        case 'top':
          updateQuery = 'UPDATE listings SET is_top = FALSE WHERE id = $1';
          break;
        case 'recommended':
          updateQuery = 'UPDATE listings SET is_recommended = FALSE WHERE id = $1';
          break;
      }

      await query(updateQuery, [promo.listing_id]);
    }

    return expired.rows.length;
  } catch (error) {
    console.error('Error expiring promotions:', error);
    return 0;
  }
};

// Get promotion statistics
const getPromotionStats = async (req, res, next) => {
  try {
    const stats = await query(`
      SELECT 
        type,
        COUNT(*) as total_count,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        SUM(CASE WHEN status = 'active' THEN price ELSE 0 END) as active_revenue,
        SUM(CASE WHEN status IN ('active', 'expired') THEN price ELSE 0 END) as total_revenue
      FROM promotions
      WHERE user_id = $1
      GROUP BY type
    `, [req.user.id]);

    res.json({ stats: stats.rows });
  } catch (error) {
    next(error);
  }
};

// Get available promotions with prices
const getAvailablePromotions = async (req, res) => {
  res.json({
    promotions: [
      {
        type: 'boost',
        name: 'Поднять в поиске',
        name_ru: 'Поднять в поиске',
        description: 'Ваше объявление будет показываться выше в результатах поиска',
        price: PROMOTION_PRICES.boost,
        unit: 'день',
      },
      {
        type: 'highlight',
        name: 'Виділити кольором',
        name_ru: 'Выделить цветом',
        description: 'Ваше объявление буде виділено кольором в списку',
        price: PROMOTION_PRICES.highlight,
        unit: 'день',
      },
      {
        type: 'top',
        name: 'Закріпити в топі',
        name_ru: 'Закрепить в топе',
        description: 'Ваше объявление буде закріплено в верхній частині списку',
        price: PROMOTION_PRICES.top,
        unit: 'день',
      },
      {
        type: 'recommended',
        name: 'Рекомендовані',
        name_ru: 'Рекомендуемые',
        description: 'Ваше объявление з\'явиться в розділі рекомендованих',
        price: PROMOTION_PRICES.recommended,
        unit: 'день',
      },
    ],
  });
};

module.exports = {
  createPromotion,
  getUserPromotions,
  activatePromotion,
  expirePromotions,
  getPromotionStats,
  getAvailablePromotions,
  PROMOTION_PRICES,
};
