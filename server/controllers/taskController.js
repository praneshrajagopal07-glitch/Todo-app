const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const { getUploadedFileUrl } = require('../utils/fileUrl');

const dueTimePattern = /^(1[0-2]|0?\d)(?::([0-5]\d))?\s*([AP]M)?$/i;

const parseDueTime = (dueTime = '23:59') => {
  const value = String(dueTime).trim();
  if (!value) return { hours: 23, minutes: 59 };

  const match = value.match(dueTimePattern);
  if (match) {
    let hours = Number(match[1]);
    const minutes = Number(match[2] || 0);
    const period = match[3]?.toUpperCase();

    if (period === 'AM') hours = hours === 12 ? 0 : hours;
    if (period === 'PM') hours = hours === 12 ? 12 : hours + 12;

    return { hours, minutes };
  }

  const [rawHours = '23', rawMinutes = '59'] = value.split(':');
  return {
    hours: Math.min(Math.max(Number(rawHours) || 0, 0), 23),
    minutes: Math.min(Math.max(Number(rawMinutes) || 0, 0), 59),
  };
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

const syncOverdueTasks = async (filter = {}) => {
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

// @desc  Get all tasks for user
// @route GET /api/tasks
const getTasks = async (req, res) => {
  await syncOverdueTasks({ userId: req.user._id });
  const { status, priority, search, sort } = req.query;
  const filter = { userId: req.user._id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const sortObj = sort === 'oldest' ? { createdAt: 1 } : sort === 'priority' ? { priority: 1 } : { createdAt: -1 };
  const tasks = await Task.find(filter).sort(sortObj);
  res.json(tasks);
};

// @desc  Get single task
// @route GET /api/tasks/:id
const getTask = async (req, res) => {
  await syncOverdueTasks({ userId: req.user._id, _id: req.params.id });
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

// @desc  Create task
// @route POST /api/tasks
const createTask = async (req, res) => {
  const { title, description, priority, dueDate, dueTime } = req.body;
  const task = await Task.create({
    title, description, priority, dueDate, dueTime,
    userId: req.user._id,
    taskImage: getUploadedFileUrl(req, req.file, 'tasks'),
  });
  if (isTaskOverdue(task)) {
    task.status = 'Expired';
    await task.save();
  }
  await ActivityLog.create({ userId: req.user._id, taskId: task._id, action: 'created', details: `Created task: ${title}` });
  res.status(201).json(task);
};

// @desc  Update task
// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const { title, description, priority, dueDate, dueTime, status } = req.body;
  task.title = title || task.title;
  task.description = description ?? task.description;
  task.priority = priority || task.priority;
  task.dueDate = dueDate || task.dueDate;
  task.dueTime = dueTime || task.dueTime;
  task.status = status || task.status;
  if (req.body.removeTaskImage === 'true') task.taskImage = '';
  if (req.file) task.taskImage = getUploadedFileUrl(req, req.file, 'tasks');
  if (task.status !== 'Completed') {
    task.status = isTaskOverdue(task) ? 'Expired' : 'Pending';
  }

  const updated = await task.save();
  await ActivityLog.create({ userId: req.user._id, taskId: task._id, action: 'updated', details: `Updated task: ${task.title}` });
  res.json(updated);
};

// @desc  Delete task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await ActivityLog.create({ userId: req.user._id, action: 'deleted', details: `Deleted task: ${task.title}` });
  res.json({ message: 'Task deleted' });
};

// @desc  Mark task complete
// @route PATCH /api/tasks/:id/complete
const completeTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status: 'Completed' },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

// @desc  Get task stats
// @route GET /api/tasks/stats
const getStats = async (req, res) => {
  await syncOverdueTasks({ userId: req.user._id });
  const userId = req.user._id;
  const [total, pending, completed, expired] = await Promise.all([
    Task.countDocuments({ userId }),
    Task.countDocuments({ userId, status: 'Pending' }),
    Task.countDocuments({ userId, status: 'Completed' }),
    Task.countDocuments({ userId, status: 'Expired' }),
  ]);
  res.json({ total, pending, completed, expired });
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, completeTask, getStats };
