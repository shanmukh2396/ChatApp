const User = require('../models/User.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc    Search registered users by name or email (excluding logged in user)
 * @route   GET /api/users/search?q=query
 * @access  Private
 */
const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.q
      ? {
          $or: [
            { name: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
          ],
        }
      : {};

    // Exclude the currently logged in user from search results
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select('-password')
      .limit(20);

    return sendSuccess(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    return sendSuccess(res, 200, 'User profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile (name, avatar)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, avatar, phoneNumber, address, bio, settings } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (name) user.name = name.trim();
    if (avatar !== undefined) user.avatar = avatar;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber.trim();
    if (address !== undefined) user.address = address.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (settings && typeof settings === 'object') {
      user.settings = {
        ...(user.settings || {}),
        ...settings,
      };
    }

    const updatedUser = await user.save();

    return sendSuccess(res, 200, 'Profile updated successfully', {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
      bio: updatedUser.bio,
      settings: updatedUser.settings,
      isOnline: updatedUser.isOnline,
      lastSeen: updatedUser.lastSeen,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchUsers,
  getUserById,
  updateUserProfile,
};
