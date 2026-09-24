const express = require('express');
const router = express.Router();
const {
  getUserConversations,
  accessOrCreatePrivateConversation,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  leaveGroup,
} = require('../controllers/conversation.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All conversation routes are protected

router.get('/', getUserConversations);
router.post('/', accessOrCreatePrivateConversation);
router.post('/group', createGroupChat);
router.put('/group/:id/rename', renameGroup);
router.put('/group/:id/add', addToGroup);
router.put('/group/:id/remove', removeFromGroup);
router.put('/group/:id/leave', leaveGroup);

module.exports = router;
