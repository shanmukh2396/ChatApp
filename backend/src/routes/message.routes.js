const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markMessagesAsRead,
} = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All message routes are protected

router.post('/', sendMessage);
router.get('/:conversationId', getMessages);
router.put('/:conversationId/read', markMessagesAsRead);

module.exports = router;
