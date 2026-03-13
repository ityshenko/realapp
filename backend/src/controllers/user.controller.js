const { query } = require('../config/db');

// Get user by ID (public profile)
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        id, name, phone, email, role, avatar_url, rating, reviews_count, 
        is_verified, created_at,
        (SELECT COUNT(*) FROM listings WHERE user_id = $1 AND status = 'active') as active_listings
      FROM users 
      WHERE id = $1 AND is_blocked = FALSE
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// Get user reviews
const getUserReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(`
      SELECT 
        r.*,
        rv.name as reviewer_name,
        rv.avatar_url as reviewer_avatar,
        l.title as listing_title,
        l.address as listing_address
      FROM reviews r
      JOIN users rv ON r.reviewer_id = rv.id
      LEFT JOIN listings l ON r.listing_id = l.id
      WHERE r.reviewee_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [id, parseInt(limit), offset]);

    const countResult = await query(
      'SELECT COUNT(*) as total FROM reviews WHERE reviewee_id = $1',
      [id]
    );

    res.json({
      reviews: result.rows,
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

// Create review for user
const createReview = async (req, res, next) => {
  try {
    const { revieweeId, listingId, rating, comment } = req.body;

    // Check if user already reviewed this user for this listing
    const existing = await query(
      'SELECT id FROM reviews WHERE reviewer_id = $1 AND reviewee_id = $2 AND listing_id = $3',
      [req.user.id, revieweeId, listingId || null]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this user' });
    }

    // Check if there was a transaction (messaging or listing interaction)
    // For simplicity, we'll allow reviews if user messaged about a listing
    if (listingId) {
      const conversationExists = await query(
        `SELECT id FROM conversations 
         WHERE listing_id = $1 
         AND (participant1_id = $2 OR participant2_id = $2)
         AND (participant1_id = $3 OR participant2_id = $3)`,
        [listingId, req.user.id, revieweeId]
      );

      if (!conversationExists.rows.length > 0) {
        return res.status(400).json({ error: 'Can only review users you have interacted with' });
      }
    }

    const result = await query(`
      INSERT INTO reviews (reviewer_id, reviewee_id, listing_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [req.user.id, revieweeId, listingId || null, rating, comment]);

    res.status(201).json({ review: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById, getUserReviews, createReview };
