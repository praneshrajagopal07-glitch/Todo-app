const express = require('express');
const router = express.Router();
const { register, login, firebaseLogin, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/firebase', firebaseLogin);
router.get('/me', protect, getMe);

module.exports = router;
