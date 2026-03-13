const { query } = require('../config/db');

// Get listing statistics
const getListingStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    // Verify ownership
    const listing = await query('SELECT user_id FROM listings WHERE id = $1', [id]);
    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (listing.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Get daily stats
    const statsResult = await query(`
      SELECT date, views, favorites, contacts_shown
      FROM listing_stats
      WHERE listing_id = $1 AND date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
      ORDER BY date DESC
    `, [id]);

    // Get total stats
    const totalResult = await query(`
      SELECT 
        SUM(views) as total_views,
        SUM(favorites) as total_favorites,
        SUM(contacts_shown) as total_contacts
      FROM listing_stats
      WHERE listing_id = $1
    `, [id]);

    res.json({
      dailyStats: statsResult.rows,
      totalStats: totalResult.rows[0] || { total_views: 0, total_favorites: 0, total_contacts: 0 },
    });
  } catch (error) {
    next(error);
  }
};

// Get user dashboard stats
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total listings
    const listingsResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive,
        COUNT(CASE WHEN status = 'sold' OR status = 'rented' THEN 1 END) as completed
      FROM listings
      WHERE user_id = $1
    `, [userId]);

    // Total views this month
    const viewsResult = await query(`
      SELECT COALESCE(SUM(views), 0) as views
      FROM listing_stats
      WHERE listing_id IN (SELECT id FROM listings WHERE user_id = $1)
        AND date >= DATE_TRUNC('month', CURRENT_DATE)
    `, [userId]);

    // Active promotions
    const promotionsResult = await query(`
      SELECT COUNT(*) as count, SUM(price) as spent
      FROM promotions
      WHERE user_id = $1 AND status = 'active'
    `, [userId]);

    // Unread messages count
    const messagesResult = await query(`
      SELECT 
        COALESCE(SUM(CASE WHEN participant1_id = $1 THEN participant1_unread_count ELSE participant2_unread_count END), 0) as unread
      FROM conversations
      WHERE participant1_id = $1 OR participant2_id = $1
    `, [userId]);

    res.json({
      listings: listingsResult.rows[0],
      views: viewsResult.rows[0],
      promotions: promotionsResult.rows[0],
      messages: { unread: parseInt(messagesResult.rows[0].unread) },
    });
  } catch (error) {
    next(error);
  }
};

// Record daily stats (cron job)
const recordDailyStats = async () => {
  try {
    const listings = await query('SELECT id, views_count, favorites_count, contacts_shown FROM listings WHERE status = $1', ['active']);

    for (const listing of listings.rows) {
      await query(`
        INSERT INTO listing_stats (listing_id, date, views, favorites, contacts_shown)
        VALUES ($1, CURRENT_DATE, $2, $3, $4)
        ON CONFLICT (listing_id, date) DO UPDATE SET
          views = EXCLUDED.views,
          favorites = EXCLUDED.favorites,
          contacts_shown = EXCLUDED.contacts_shown
      `, [listing.id, listing.views_count, listing.favorites_count, listing.contacts_shown]);
    }

    return listings.rows.length;
  } catch (error) {
    console.error('Error recording daily stats:', error);
    return 0;
  }
};

module.exports = {
  getListingStats,
  getDashboardStats,
  recordDailyStats,
};
