const jwt = require('jsonwebtoken');

/**
 * Generate a 7-day Auth JWT and set it in an HTTP-only cookie.
 * @param {Object} res - Express response object
 * @param {String} userId - MongoDB User ObjectId string
 * @returns {String} token
 */
const generateAuthTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true, // Prevents XSS attacks (JS cannot read this cookie)
    secure: isProduction, // HTTPS only in production (required for sameSite: 'none')
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-domain Vercel <-> Render
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  });

  return token;
};

/**
 * Generate a short-lived (60s) Socket Ticket for Socket.IO authentication.
 * @param {String} userId - MongoDB User ObjectId string
 * @returns {String} ticket JWT
 */
const generateSocketTicket = (userId) => {
  return jwt.sign(
    { userId, purpose: 'socket_handshake' },
    process.env.SOCKET_TICKET_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.SOCKET_TICKET_EXPIRES_IN || '60s',
    }
  );
};

/**
 * Clear the HTTP-only auth cookie upon logout.
 * @param {Object} res - Express response object
 */
const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
    path: '/',
  });
};

module.exports = {
  generateAuthTokenAndSetCookie,
  generateSocketTicket,
  clearAuthCookie,
};
