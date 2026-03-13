const { query } = require('../config/db');

// Get user notifications
const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    const conditions = ['user_id = $1'];
    const values = [req.user.id];

    if (unreadOnly === 'true') {
      conditions.push('is_read = FALSE');
    }

    const result = await query(`
      SELECT * FROM notifications
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `, [...values, parseInt(limit), offset]);

    const countQuery = `SELECT COUNT(*) as total FROM notifications WHERE ${conditions.join(' AND ')}`;
    const countResult = await query(countQuery, values);

    res.json({
      notifications: result.rows,
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

// Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query(`
      UPDATE notifications 
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND user_id = $2
    `, [id, req.user.id]);

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res, next) => {
  try {
    await query(`
      UPDATE notifications 
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
      WHERE user_id = $1 AND is_read = FALSE
    `, [req.user.id]);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// Delete notification
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [id, req.user.id]);

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

// Get unread count
const getUnreadCount = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [req.user.id]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
