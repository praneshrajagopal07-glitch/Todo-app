const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { getUploadedFileUrl } = require('../utils/fileUrl');

// @desc  Get profile
// @route GET /api/profile
const getProfile = async (req, res) => res.json(req.user);

// @desc  Update profile (name, email, theme)
// @route PUT /api/profile
const updateProfile = async (req, res) => {
  const { name, email, theme } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (email) user.email = email;
  if (theme) user.theme = theme;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, profileImage: updated.profileImage, theme: updated.theme });
};

// @desc  Change password
// @route PUT /api/profile/password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!await user.matchPassword(currentPassword)) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
};

// @desc  Upload profile image
// @route PUT /api/profile/image
const uploadProfileImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
  const profileImage = getUploadedFileUrl(req, req.file);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage },
    { new: true }
  ).select('-password');
  res.json(user);
};

module.exports = { getProfile, updateProfile, changePassword, uploadProfileImage };
