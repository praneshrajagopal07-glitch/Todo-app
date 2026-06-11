const getUploadedFileUrl = (req, file, folder = 'profiles') => {
  if (!file) return '';
  if (file.path && /^https?:\/\//i.test(file.path)) return file.path;
  if (file.filename) {
    return `${req.protocol}://${req.get('host')}/uploads/${folder}/${file.filename}`;
  }
  return file.path || '';
};

module.exports = { getUploadedFileUrl };
