const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfile, uploadTask } = require('../middleware/uploadMiddleware');

router.post('/profile', protect, uploadProfile.single('image'), uploadFile);
router.post('/task', protect, uploadTask.single('image'), uploadFile);

module.exports = router;
