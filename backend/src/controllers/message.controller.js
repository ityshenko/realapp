const { query } = require('../config/db');
const { validationResult } = require('express-validator');

// Get all conversations for user
const getConversations = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        c.*,
        CASE 
          WHEN c.participant1_id = $1 THEN c.participant2_id
          ELSE c.participant1_id
        END as other_user_id,
        COALESCE(
          CASE 
            WHEN c.participant1_id = $1 THEN u2.name
            ELSE u1.name
          END,
          ''
        ) as other_user_name,
        COALESCE(
          CASE 
            WHEN c.participant1_id = $1 THEN u2.avatar_url
            ELSE u1.avatar_url
          END,
          ''
        ) as other_user_avatar,
        CASE 
          WHEN c.participant1_id = $1 THEN c.participant1_unread_count
          ELSE c.participant2_unread_count
        END as unread_count,
        l.title as listing_title,
        l.primary_photo as listing_photo
      FROM conversations c
      LEFT JOIN users u1 ON c.participant1_id = u1.id
      LEFT JOIN users u2 ON c.participant2_id = u2.id
      LEFT JOIN listings l ON c.listing_id = l.id
      WHERE c.participant1_id = $1 OR c.participant2_id = $1
      ORDER BY c.last_message_at DESC NULLS LAST
    `, [req.user.id]);

    res.json({
      conversations: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Get or create conversation with another user
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { userId, listingId } = req.body;

    // Check if users are trying to message themselves
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    // Check if other user exists
    const userExists = await query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if conversation already exists
    const existing = await query(`
      SELECT id FROM conversations 
      WHERE (participant1_id = $1 AND participant2_id = $2)
         OR (participant1_id = $2 AND participant2_id = $1)
    `, [req.user.id, userId]);

    if (existing.rows.length > 0) {
      return res.json({ conversation: existing.rows[0], created: false });
    }

    // Create new conversation
    const result = await query(`
      INSERT INTO conversations (participant1_id, participant2_id, listing_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [req.user.id, userId, listingId || null]);

    res.status(201).json({
      conversation: result.rows[0],
      created: true,
    });
  } catch (error) {
    next(error);
  }
};

// Get messages in a conversation
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Verify user is participant
    const conversation = await query(
      'SELECT * FROM conversations WHERE id = $1 AND (participant1_id = $2 OR participant2_id = $2)',
      [conversationId, req.user.id]
    );

    if (conversation.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Mark messages as read
    await query(`
      UPDATE messages 
      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
      WHERE conversation_id = $1 
        AND sender_id != $2 
        AND is_read = FALSE
    `, [conversationId, req.user.id]);

    // Reset unread count
    await query(`
      UPDATE conversations 
      SET 
        participant1_unread_count = CASE WHEN participant1_id = $1 THEN 0 ELSE participant1_unread_count END,
        participant2_unread_count = CASE WHEN participant2_id = $1 THEN 0 ELSE participant2_unread_count END
      WHERE id = $2
    `, [req.user.id, conversationId]);

    // Get messages
    const result = await query(`
      SELECT 
        m.*,
        u.name as sender_name,
        u.avatar_url as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2 OFFSET $3
    `, [conversationId, parseInt(limit), offset]);

    res.json({
      messages: result.rows.reverse(), // Reverse to get chronological order
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Send message
const sendMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { conversationId, text, imageUrl } = req.body;

    if (!text && !imageUrl) {
      return res.status(400).json({ error: 'Message must contain text or image' });
    }

    // Verify user is participant
    const conversation = await query(
      'SELECT * FROM conversations WHERE id = $1 AND (participant1_id = $2 OR participant2_id = $2)',
      [conversationId, req.user.id]
    );

    if (conversation.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const conv = conversation.rows[0];
    const isParticipant1 = conv.participant1_id === req.user.id;

    // Create message
    const result = await query(`
      INSERT INTO messages (conversation_id, sender_id, text, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [conversationId, req.user.id, text, imageUrl]);

    const message = result.rows[0];

    // Update conversation
    await query(`
      UPDATE conversations SET
        last_message = $1,
        last_message_at = CURRENT_TIMESTAMP,
        participant1_unread_count = CASE WHEN participant1_id = $2 THEN participant1_unread_count ELSE participant1_unread_count + 1 END,
        participant2_unread_count = CASE WHEN participant2_id = $2 THEN participant2_unread_count ELSE participant2_unread_count + 1 END
      WHERE id = $3
    `, [text || '📷 Фото', req.user.id, conversationId]);

    // Emit WebSocket event (handled in socket.js)
    if (req.io) {
      const otherUserId = isParticipant1 ? conv.participant2_id : conv.participant1_id;
      req.io.to(`user:${otherUserId}`).emit('message:new', {
        conversationId,
        message,
        senderId: req.user.id,
      });
    }

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

// Mark conversation as read
const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    await query(`
      UPDATE conversations SET
        participant1_unread_count = CASE WHEN participant1_id = $1 THEN 0 ELSE participant1_unread_count END,
        participant2_unread_count = CASE WHEN participant2_id = $1 THEN 0 ELSE participant2_unread_count END
      WHERE id = $2 AND (participant1_id = $1 OR participant2_id = $1)
    `, [req.user.id, conversationId]);

    res.json({ message: 'Conversation marked as read' });
  } catch (error) {
    next(error);
  }
};

// Delete message
const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await query('SELECT sender_id FROM messages WHERE id = $1', [messageId]);
    
    if (message.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.rows[0].sender_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    await query('DELETE FROM messages WHERE id = $1', [messageId]);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get unread count
const getUnreadCount = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        COALESCE(SUM(CASE WHEN participant1_id = $1 THEN participant1_unread_count ELSE participant2_unread_count END), 0) as total_unread
      FROM conversations
      WHERE participant1_id = $1 OR participant2_id = $1
    `, [req.user.id]);

    res.json({
      unreadCount: parseInt(result.rows[0].total_unread),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getUnreadCount,
};
