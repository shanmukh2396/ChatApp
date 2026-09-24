const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  getSocketTicket,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require valid JWT cookie or Bearer token)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.get('/socket-ticket', protect, getSocketTicket);

module.exports = router;
