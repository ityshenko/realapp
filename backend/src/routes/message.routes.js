const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authMiddleware } = require('../middleware/auth');

const sendMessageValidation = [
  body('text')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Message too long'),
  body('imageUrl')
    .optional()
    .isURL().withMessage('Invalid image URL'),
];

router.use(authMiddleware);

router.get('/', messageController.getConversations);
router.post('/conversation', messageController.getOrCreateConversation);
router.get('/:conversationId/messages', messageController.getMessages);
router.post('/send', sendMessageValidation, messageController.sendMessage);
router.put('/:conversationId/read', messageController.markAsRead);
router.delete('/messages/:messageId', messageController.deleteMessage);
router.get('/unread/count', messageController.getUnreadCount);

module.exports = router;
