const express = require('express');
const router = express.Router();
const {
  searchUsers,
  getUserById,
  updateUserProfile,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All user routes are protected

router.get('/search', searchUsers);
router.get('/:id', getUserById);
router.put('/profile', updateUserProfile);

module.exports = router;
