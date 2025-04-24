const { validationResult } = require('express-validator');
const User = require('../models/user');
const Admin = require('../models/admin');
const Task = require('../models/task');


exports.addTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const { title, description, dueDate, priority, status, assignedTo, recurring } = req.body;

        let user = await User.findOne({ userName: assignedTo })
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        const task = new Task({
            title: title,
            description: description,
            dueDate: dueDate,
            priority: priority,
            status: status,
            assignedTo: user._id,
            recurring: recurring || 'none',
            createdBy: req.userId,
        });
        const savedTask = await task.save();
        res.status(201).json({
            message: 'Task created successfully',
            task: savedTask,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'userName')
            .sort({ createdAt: -1 });

        const formatDate = (date) => {
            if (!date) return null;
            const d = new Date(date);
            return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
        };

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
            message: 'All tasks fetched successfully',
            total: formattedTasks.length,
            tasks: formattedTasks,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.deleteTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        await Task.findByIdAndDelete(taskId);

        res.status(200).json({
            message: 'Task deleted successfully',
            taskId: taskId,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
};

exports.getTaskByIdAdmin = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId).populate('assignedTo', 'userName');
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Task fetched successfully (admin)',
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

exports.updateTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const taskId = req.params.id;
        const { title, description, dueDate, priority, status, assignedTo, recurring } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error;
        }

        // Find the user by userName for assignedTo
        const user = await User.findOne({ userName: assignedTo });
        if (!user) {
            const error = new Error('Assigned user not found');
            error.statusCode = 404;
            throw error;
        }

        // Update fields
        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.dueDate = dueDate ?? task.dueDate;
        task.priority = priority ?? task.priority;
        task.status = status ?? task.status;
        task.recurring = recurring ?? task.recurring;
        task.assignedTo = user._id;

        const updatedTask = await task.save();

        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, 'name userName email');

        res.status(200).json({
            message: 'Users fetched successfully',
            users,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};