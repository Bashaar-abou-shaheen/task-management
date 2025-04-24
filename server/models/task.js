const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do',
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recurring: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly'],
        default: 'none',
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin', // or 'Admin' if you want to distinguish creators
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema)