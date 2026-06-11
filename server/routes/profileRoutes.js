const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, uploadProfileImage } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfile } = require('../middleware/uploadMiddleware');

router.use(protect);
router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', changePassword);
router.put('/image', uploadProfile.single('profileImage'), uploadProfileImage);

module.exports = router;
