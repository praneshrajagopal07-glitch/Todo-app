const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const initFirebase = require('../config/firebase');

// @desc  Register user
// @route POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'That Email account already registered' });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    profileImage: user.profileImage, theme: user.theme,
    token: generateToken(user._id),
  });
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'You entered invalid Email' });
  }
  if (!(await user.matchPassword(password))) {
    return res.status(400).json({ message: 'You entered password is wrong' });
  }
  res.json({
    _id: user._id, name: user.name, email: user.email,
    profileImage: user.profileImage, theme: user.theme,
    token: generateToken(user._id),
  });
};

// @desc  Firebase / Google login
// @route POST /api/auth/firebase
const firebaseLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const admin = initFirebase();
    const decoded = await admin.auth().verifyIdToken(idToken);
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      user = await User.create({
        name: decoded.name || 'User',
        email: decoded.email,
        profileImage: decoded.picture || '',
        provider: 'google',
        firebaseUid: decoded.uid,
      });
    }
    res.json({
      _id: user._id, name: user.name, email: user.email,
      profileImage: user.profileImage, theme: user.theme,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, firebaseLogin, getMe };
