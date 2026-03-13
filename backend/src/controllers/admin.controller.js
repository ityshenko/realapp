const { query } = require('../config/db');

// Get all users (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, role, isBlocked } = req.query;
    const offset = (page - 1) * limit;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (role) {
      conditions.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }

    if (isBlocked !== undefined) {
      conditions.push(`is_blocked = $${paramIndex}`);
      values.push(isBlocked === 'true');
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT 
        id, name, phone, email, role, avatar_url, rating, reviews_count,
        is_verified, is_blocked, created_at,
        (SELECT COUNT(*) FROM listings WHERE user_id = users.id) as listings_count
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...values, parseInt(limit), offset]);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM users ${whereClause}
    `, values);

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Block/unblock user
const toggleUserBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    await query(
      'UPDATE users SET is_blocked = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [isBlocked, id]
    );

    res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    next(error);
  }
};

// Get all listings (including inactive/blocked)
const getAllListings = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const offset = (page - 1) * limit;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`l.status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT 
        l.*,
        d.name as district_name,
        u.name as owner_name,
        u.phone as owner_phone,
        (
          SELECT url FROM photos WHERE listing_id = l.id AND is_primary = TRUE LIMIT 1
        ) as primary_photo
      FROM listings l
      LEFT JOIN districts d ON l.district_id = d.id
      LEFT JOIN users u ON l.user_id = u.id
      ${whereClause}
      ORDER BY l.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...values, parseInt(limit), offset]);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM listings l ${whereClause}
    `, values);

    res.json({
      listings: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update listing status (moderation)
const updateListingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'moderation', 'blocked', 'sold', 'rented'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await query(
      'UPDATE listings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );

    res.json({ message: `Listing status updated to ${status}` });
  } catch (error) {
    next(error);
  }
};

// Delete listing (admin)
const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM listings WHERE id = $1', [id]);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get platform statistics
const getPlatformStats = async (req, res, next) => {
  try {
    // Total users
    const usersResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN role = 'owner' THEN 1 END) as owners,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as users,
        COUNT(CASE WHEN is_blocked = TRUE THEN 1 END) as blocked
      FROM users
    `);

    // Total listings
    const listingsResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN deal_type = 'rent' THEN 1 END) as rent,
        COUNT(CASE WHEN deal_type = 'sale' THEN 1 END) as sale
      FROM listings
    `);

    // Revenue this month
    const revenueResult = await query(`
      SELECT 
        COALESCE(SUM(amount), 0) as total,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as completed
      FROM transactions
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `);

    // Active promotions
    const promotionsResult = await query(`
      SELECT COUNT(*) as count, COALESCE(SUM(price), 0) as revenue
      FROM promotions
      WHERE status = 'active'
    `);

    res.json({
      users: usersResult.rows[0],
      listings: listingsResult.rows[0],
      revenue: revenueResult.rows[0],
      promotions: promotionsResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Get recent activity
const getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    // Recent registrations
    const registrations = await query(`
      SELECT id, name, phone, created_at, 'registration' as type
      FROM users
      ORDER BY created_at DESC
      LIMIT $1
    `, [parseInt(limit) / 3]);

    // Recent listings
    const listings = await query(`
      SELECT l.id, l.title, l.price, u.name as owner_name, l.created_at, 'listing' as type
      FROM listings l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT $1
    `, [parseInt(limit) / 3]);

    // Recent transactions
    const transactions = await query(`
      SELECT t.id, t.amount, t.type, t.status, u.name as user_name, t.created_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT $1
    `, [parseInt(limit) / 3]);

    res.json({
      registrations: registrations.rows,
      listings: listings.rows,
      transactions: transactions.rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  toggleUserBlock,
  getAllListings,
  updateListingStatus,
  deleteListing,
  getPlatformStats,
  getRecentActivity,
};
