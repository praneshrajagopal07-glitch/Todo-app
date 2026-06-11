const Task = require('../models/Task');

const dueTimePattern = /^(1[0-2]|0?\d)(?::([0-5]\d))?\s*([AP]M)?$/i;

const parseDueTime = (dueTime = '23:59') => {
  const value = String(dueTime).trim();

  if (!value) return { hours: 23, minutes: 59 };

  const twelveHourMatch = value.match(dueTimePattern);
  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2] || 0);
    const period = twelveHourMatch[3]?.toUpperCase();

    if (period === 'AM') {
      hours = hours === 12 ? 0 : hours;
    } else if (period === 'PM') {
      hours = hours === 12 ? 12 : hours + 12;
    }

    return { hours, minutes };
  }

  const [rawHours = '23', rawMinutes = '59'] = value.split(':');
  const hours = Math.min(Math.max(Number(rawHours) || 0, 0), 23);
  const minutes = Math.min(Math.max(Number(rawMinutes) || 0, 0), 59);

  return { hours, minutes };
};

const getTaskDueDateTime = (task) => {
  if (!task?.dueDate) return null;

  const baseDate = new Date(task.dueDate);
  if (Number.isNaN(baseDate.getTime())) return null;

  const { hours, minutes } = parseDueTime(task.dueTime);
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    0,
    0
  );
};

const isTaskOverdue = (task, now = new Date()) => {
  if (!task) return false;
  const dueAt = getTaskDueDateTime(task);
  if (!dueAt) return false;
  return dueAt.getTime() <= now.getTime();
};

const expireOverdueTasks = async (filter = {}) => {
  const tasks = await Task.find({ ...filter, status: { $in: ['Pending', 'Expired'] } });
  const overdueIds = [];
  const reopenIds = [];

  for (const task of tasks) {
    if (isTaskOverdue(task)) overdueIds.push(task._id);
    else reopenIds.push(task._id);
  }

  let modifiedCount = 0;

  if (overdueIds.length) {
    const result = await Task.updateMany(
      { _id: { $in: overdueIds } },
      { $set: { status: 'Expired' } }
    );
    modifiedCount += result.modifiedCount || 0;
  }

  if (reopenIds.length) {
    const result = await Task.updateMany(
      { _id: { $in: reopenIds } },
      { $set: { status: 'Pending' } }
    );
    modifiedCount += result.modifiedCount || 0;
  }

  return { modifiedCount };
};

module.exports = {
  expireOverdueTasks,
  getTaskDueDateTime,
  isTaskOverdue,
  parseDueTime,
};
