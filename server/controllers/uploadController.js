const { getUploadedFileUrl } = require('../utils/fileUrl');

// @desc  Upload a file (generic endpoint)
// @route POST /api/upload/profile or /api/upload/task
const uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const folder = req.baseUrl.includes('/task') ? 'tasks' : 'profiles';
  res.json({ url: getUploadedFileUrl(req, req.file, folder), message: 'File uploaded successfully' });
};

module.exports = { uploadFile };
