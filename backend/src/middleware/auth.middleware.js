const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendError } = require('../utils/apiResponse');

/**
 * Protect route middleware:
 * Validates JWT from HTTP-only cookie (or Bearer Authorization header).
 * Fetches user profile and attaches to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP-only cookie first (browser requests)
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // 2. Check Authorization header (Postman / API testing fallback)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Not authorized. Please log in to continue.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user (exclude password)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return sendError(res, 401, 'User belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Invalid authentication token.');
    }
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Authentication token has expired. Please log in again.');
    }
    return sendError(res, 500, 'Authentication error: ' + error.message);
  }
};

module.exports = { protect };
