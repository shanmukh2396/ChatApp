const User = require('../models/User.model');
const {
  generateAuthTokenAndSetCookie,
  generateSocketTicket,
  clearAuthCookie,
} = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return sendError(res, 400, 'Please provide name, email, and password.');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters long.');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return sendError(res, 409, 'An account with this email already exists.');
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatar: avatar || undefined,
      isOnline: true,
    });

    // Set HTTP-only auth cookie
    generateAuthTokenAndSetCookie(res, user._id);

    return sendSuccess(res, 201, 'Account created successfully!', {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password.');
    }

    // Find user & include password field for verification
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Update status to online
    user.isOnline = true;
    await user.save({ validateBeforeSave: false });

    // Set HTTP-only auth cookie
    generateAuthTokenAndSetCookie(res, user._id);

    return sendSuccess(res, 200, 'Login successful!', {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // Mark user as offline
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        isOnline: false,
        lastSeen: new Date(),
      });
    }

    // Clear HTTP-only cookie
    clearAuthCookie(res);

    return sendSuccess(res, 200, 'Logged out successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'User profile retrieved.', req.user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get short-lived (60s) Socket Ticket for Socket.IO handshake
 * @route   GET /api/auth/socket-ticket
 * @access  Private (Protected by HTTP-only cookie)
 */
const getSocketTicket = async (req, res, next) => {
  try {
    const ticket = generateSocketTicket(req.user._id);
    return sendSuccess(res, 200, 'Socket ticket generated.', { ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  getSocketTicket,
};
