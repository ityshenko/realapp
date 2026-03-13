const { query } = require('../config/db');

// Socket.IO connection handler
const setupWebSocket = (io) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const result = await query(
        'SELECT id, name, role, is_blocked FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return next(new Error('User not found'));
      }

      const user = result.rows[0];

      if (user.is_blocked) {
        return next(new Error('User is blocked'));
      }

      socket.userId = user.id;
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Handle joining a conversation room
    socket.on('conversation:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Handle leaving a conversation room
    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Handle typing indicator
    socket.on('typing:start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:started', {
        userId: socket.userId,
        conversationId,
      });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stopped', {
        userId: socket.userId,
        conversationId,
      });
    });

    // Handle message sent via WebSocket (alternative to REST API)
    socket.on('message:send', async ({ conversationId, text, imageUrl }) => {
      try {
        const message = await query(`
          INSERT INTO messages (conversation_id, sender_id, text, image_url)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `, [conversationId, socket.userId, text, imageUrl]);

        // Get conversation participants
        const conversation = await query(
          'SELECT participant1_id, participant2_id FROM conversations WHERE id = $1',
          [conversationId]
        );

        if (conversation.rows.length > 0) {
          const conv = conversation.rows[0];
          const otherUserId = conv.participant1_id === socket.userId 
            ? conv.participant2_id 
            : conv.participant1_id;

          // Emit to other participant
          io.to(`user:${otherUserId}`).emit('message:new', {
            conversationId,
            message: message.rows[0],
            senderId: socket.userId,
          });

          // Emit to conversation room
          io.to(`conversation:${conversationId}`).emit('message:new', {
            conversationId,
            message: message.rows[0],
            senderId: socket.userId,
          });

          // Update conversation last message
          await query(`
            UPDATE conversations SET
              last_message = $1,
              last_message_at = CURRENT_TIMESTAMP
            WHERE id = $2
          `, [text || '📷 Фото', conversationId]);
        }

        socket.emit('message:sent', message.rows[0]);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle mark as read
    socket.on('messages:read', ({ conversationId }) => {
      io.to(`conversation:${conversationId}`).emit('messages:read', {
        userId: socket.userId,
        conversationId,
      });
    });

    // Handle notifications
    socket.on('notification:read', async ({ notificationId }) => {
      try {
        await query(
          'UPDATE notifications SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2',
          [notificationId, socket.userId]
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  // Periodic cleanup of expired promotions
  setInterval(async () => {
    try {
      const { expirePromotions } = require('../controllers/promotion.controller');
      const expiredCount = await expirePromotions();
      if (expiredCount > 0) {
        console.log(`Expired ${expiredCount} promotions`);
      }
    } catch (error) {
      console.error('Error expiring promotions:', error);
    }
  }, 60 * 60 * 1000); // Check every hour

  // Daily stats recording
  setInterval(async () => {
    try {
      const { recordDailyStats } = require('../controllers/stats.controller');
      const recordedCount = await recordDailyStats();
      console.log(`Recorded stats for ${recordedCount} listings`);
    } catch (error) {
      console.error('Error recording daily stats:', error);
    }
  }, 24 * 60 * 60 * 1000); // Run daily at midnight
};

module.exports = { setupWebSocket };
