const fs = require('fs');
const path = require('path');
const multer = require('multer');

const profileUploadsDir = path.join(__dirname, '..', 'uploads', 'profiles');
const taskUploadsDir = path.join(__dirname, '..', 'uploads', 'tasks');
fs.mkdirSync(profileUploadsDir, { recursive: true });
fs.mkdirSync(taskUploadsDir, { recursive: true });

const localDiskStorage = (destinationDir) => multer.diskStorage({
  destination: (_, __, cb) => cb(null, destinationDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ext || '.png';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, uniqueName);
  },
});

const imageOnly = (_, file, cb) => {
  if (!file.mimetype?.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  return cb(null, true);
};

const uploadProfile = multer({
  storage: localDiskStorage(profileUploadsDir),
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadTask = multer({
  storage: localDiskStorage(taskUploadsDir),
  fileFilter: imageOnly,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { uploadProfile, uploadTask, profileUploadsDir, taskUploadsDir };
