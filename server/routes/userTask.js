const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const userTaskController = require('../controllers/userTask.js');
const isAuth = require('../middleware/isAuth.js');

// @route   GET /api/user-tasks/:id
// @desc    Get task by ID (only if it's assigned to the current user)
router.get('/:id',
    isAuth,
    param('id').isMongoId().withMessage('Invalid task ID'),
    userTaskController.getTaskByIdUser
);

// @route   GET /api/user-tasks/
// @desc    Get all tasks assigned to the current user
router.get('/',
    isAuth,
    userTaskController.getAllTasksForUser
);

// @route   PUT /api/user-tasks/:id/status
// @desc    Update status of a task (only if assigned to the current user)
router.put('/:id/status', [
    isAuth,
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status'),
], userTaskController.updateOwnTaskStatus);

module.exports = router;
