const express = require('express');
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask, completeTask, getStats } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validationMiddleware');
const { uploadTask } = require('../middleware/uploadMiddleware');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', uploadTask.single('taskImage'), validateTask, createTask);
router.put('/:id', uploadTask.single('taskImage'), updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', completeTask);

module.exports = router;
