const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const adminTaskController = require('../controllers/adminTask.js');
const isAdmin = require('../middleware/isAdmin.js');

// @route GET /admin/users
router.get('/users', isAdmin, adminTaskController.getAllUsers);

// @route   POST /api/admin-tasks/
// @desc    Create a new task
router.post('/', [
    isAdmin,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('assignedTo').notEmpty().withMessage('Assigned user (userName) is required'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['To Do', 'In Progress', 'Done']),
    body('recurring').optional().isIn(['none', 'daily', 'weekly', 'monthly']),
], adminTaskController.addTask);

// @route   PUT /api/admin-tasks/:id
// @desc    Update an existing task by ID
router.put('/:id', [
    isAdmin,
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('assignedTo').notEmpty().withMessage('Assigned user (userName) is required'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['To Do', 'In Progress', 'Done']),
    body('recurring').optional().isIn(['none', 'daily', 'weekly', 'monthly']),
], adminTaskController.updateTask);

// @route   GET /api/admin-tasks/
// @desc    Get all tasks (admin only)
router.get('/', isAdmin, adminTaskController.getAllTasks);

// @route   DELETE /api/admin-tasks/:id
// @desc    Delete a task by ID
router.delete('/:id', [
    isAdmin,
    param('id').isMongoId().withMessage('Invalid task ID'),
], adminTaskController.deleteTaskById);

// @route   GET /api/admin-tasks/:id
// @desc    Get a specific task by ID (admin can access all)
router.get('/:id', [
    isAdmin,
    param('id').isMongoId().withMessage('Invalid task ID'),
], adminTaskController.getTaskByIdAdmin);


module.exports = router;
