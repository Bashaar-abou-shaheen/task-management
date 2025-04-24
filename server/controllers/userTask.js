const { validationResult } = require('express-validator');
const User = require('../models/user');
const Task = require('../models/task');

const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
};

// ✅ USER - Fetch own task only
exports.getTaskByIdUser = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId).populate('assignedTo', 'userName');
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Check if this task belongs to the logged-in user
        if (task.assignedTo._id.toString() !== req.userId.toString()) {
            const error = new Error('You are not authorized to view this task');
            error.statusCode = 403;
            throw error;
        }
        res.status(200).json({
            message: 'Task fetched successfully (user)',
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                dueDate: formatDate(task.dueDate),
                priority: task.priority,
                status: task.status,
                recurring: task.recurring,
                assignedTo: task.assignedTo?.userName || 'Unassigned',
                createdAt: formatDate(task.createdAt),
            },
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};


// ✅ USER: Get all their tasks
exports.getAllTasksForUser = async (req, res, next) => {
    try {
        const tasks = await Task.find({ assignedTo: req.userId })
            .populate('assignedTo', 'userName')
            .sort({ createdAt: -1 });

        const formattedTasks = tasks.map((task) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            dueDate: formatDate(task.dueDate),
            priority: task.priority,
            status: task.status,
            recurring: task.recurring,
            assignedTo: task.assignedTo?.userName || 'Unassigned',
            createdAt: formatDate(task.createdAt),
        }));

        res.status(200).json({
            message: 'Your tasks fetched successfully',
            total: formattedTasks.length,
            tasks: formattedTasks,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.updateOwnTaskStatus = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const { status } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Check if the user owns the task
        if (task.assignedTo.toString() !== req.userId.toString()) {
            const error = new Error('You are not authorized to update this task');
            error.statusCode = 403;
            throw error;
        }

        // Update only the status
        task.status = status;
        const updatedTask = await task.save();

        res.status(200).json({
            message: 'Task status updated successfully',
            task: {
                id: updatedTask._id,
                status: updatedTask.status,
            },
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};