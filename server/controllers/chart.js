const Task = require('../models/task');
const User = require('../models/user');
const moment = require('moment');

exports.getDashboardSummary = async (req, res, next) => {
    try {
        // Total number of tasks
        const totalTasks = await Task.countDocuments();

        // Tasks by status
        const completedTasks = await Task.countDocuments({ status: "Done" });
        const pendingTasks = await Task.countDocuments({ status: { $ne: "Done" } });

        // Total users
        const totalUsers = await User.countDocuments();

        // Active today = users who created a task today (you can tweak this logic)
        const startOfToday = moment().startOf("day").toDate();
        const endOfToday = moment().endOf("day").toDate();

        const activeToday = await Task.distinct("createdBy", {
            createdAt: { $gte: startOfToday, $lte: endOfToday },
        }).then((users) => users.length);

        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            totalUsers,
            activeToday,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};


exports.getTaskStatusCounts = async (req, res, next) => {
    try {
        const statusCounts = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Format the response into the shape: { "To Do": 20, "In Progress": 30, "Done": 70 }
        const formattedCounts = {
            "To Do": 0,
            "In Progress": 0,
            "Done": 0,
        };

        statusCounts.forEach((entry) => {
            if (formattedCounts.hasOwnProperty(entry._id)) {
                formattedCounts[entry._id] = entry.count;
            }
        });

        res.status(200).json(formattedCounts);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getDailyTaskStats = async (req, res, next) => {
    try {
        // Define the number of days you want stats for (e.g., last 7 days)
        const days = 7;
        const today = moment().endOf("day");
        const startDate = moment().subtract(days - 1, "days").startOf("day");

        // Step 1: Count tasks created per day
        const createdTasks = await Task.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate.toDate(),
                        $lte: today.toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    created: { $sum: 1 },
                },
            },
        ]);

        // Step 2: Count tasks marked as "Done" per day
        const completedTasks = await Task.aggregate([
            {
                $match: {
                    status: "Done",
                    updatedAt: {
                        $gte: startDate.toDate(),
                        $lte: today.toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
                    },
                    completed: { $sum: 1 },
                },
            },
        ]);

        // Combine both datasets into one map
        const resultMap = {};

        // Initialize with created
        createdTasks.forEach((entry) => {
            resultMap[entry._id] = { date: entry._id, created: entry.created, completed: 0 };
        });

        // Merge in completed
        completedTasks.forEach((entry) => {
            if (resultMap[entry._id]) {
                resultMap[entry._id].completed = entry.completed;
            } else {
                resultMap[entry._id] = { date: entry._id, created: 0, completed: entry.completed };
            }
        });

        // Ensure all 7 days are present
        const finalStats = [];
        for (let i = 0; i < days; i++) {
            const dateStr = moment(startDate).add(i, "days").format("YYYY-MM-DD");
            finalStats.push(resultMap[dateStr] || { date: dateStr, created: 0, completed: 0 });
        }

        res.status(200).json(finalStats);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getTaskPriorityStats = async (req, res, next) => {
    try {
        const priorityCounts = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Format into consistent structure
        const result = {
            Low: 0,
            Medium: 0,
            High: 0,
        };

        priorityCounts.forEach((item) => {
            if (result.hasOwnProperty(item._id)) {
                result[item._id] = item.count;
            }
        });

        res.status(200).json(result);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.getUserTaskCounts = async (req, res, next) => {
    try {
        const taskCounts = await Task.aggregate([
            {
                $group: {
                    _id: "$assignedTo",
                    tasks: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users", // make sure this matches your actual MongoDB collection name
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: 0,
                    user: "$user.userName", // or "$user.name" based on your schema
                    tasks: 1,
                },
            },
            {
                $sort: { tasks: -1 }, // optional: sort by task count descending
            },
        ]);

        res.status(200).json(taskCounts);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
