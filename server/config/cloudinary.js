const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'todo-app/profiles', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

const taskStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'todo-app/tasks', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});

module.exports = { cloudinary, profileStorage, taskStorage };
