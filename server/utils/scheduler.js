const cron = require('node-cron');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('./sendEmail');
const { expireOverdueTasks } = require('./taskExpiry');

// Run every minute: mark overdue tasks as Expired
const startExpiredTaskScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const result = await expireOverdueTasks();
      console.log(`[Scheduler] Marked ${result.modifiedCount || 0} tasks as Expired`);
    } catch (err) {
      console.error('[Scheduler] Expired task error:', err.message);
    }
  });
  console.log('[Scheduler] Expired task scheduler started');
};

// Run every day at 9 AM: notify users of tasks due tomorrow
const startNotificationScheduler = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const start = new Date(tomorrow.setHours(0, 0, 0, 0));
      const end = new Date(tomorrow.setHours(23, 59, 59, 999));

      const tasks = await Task.find({
        status: 'Pending',
        dueDate: { $gte: start, $lte: end },
      }).populate('userId', 'name email');

      for (const task of tasks) {
        const user = task.userId;
        // Create in-app notification
        await Notification.create({
          userId: user._id,
          taskId: task._id,
          message: `Reminder: "${task.title}" is due tomorrow!`,
          type: 'due_reminder',
        });
        // Send email reminder
        await sendEmail({
          to: user.email,
          subject: `⏰ Task Due Tomorrow: ${task.title}`,
          html: `<h2>Hi ${user.name},</h2><p>Your task <strong>${task.title}</strong> is due tomorrow (${task.dueDate.toDateString()}).</p><p>Priority: ${task.priority}</p>`,
        }).catch(() => {}); // silently fail email errors
      }
      console.log(`[Scheduler] Sent ${tasks.length} due-tomorrow notifications`);
    } catch (err) {
      console.error('[Scheduler] Notification error:', err.message);
    }
  });
  console.log('[Scheduler] Notification scheduler started');
};

module.exports = { startExpiredTaskScheduler, startNotificationScheduler };
