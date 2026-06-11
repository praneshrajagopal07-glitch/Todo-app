const Notification = require('../models/Notification');

// @desc  Get user notifications
// @route GET /api/notifications
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .populate('taskId', 'title status')
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(notifications);
};

// @desc  Mark notification as read
// @route PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notif) return res.status(404).json({ message: 'Notification not found' });
  res.json(notif);
};

// @desc  Mark all as read
// @route PATCH /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
};

// @desc  Delete notification
// @route DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: 'Notification deleted' });
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
