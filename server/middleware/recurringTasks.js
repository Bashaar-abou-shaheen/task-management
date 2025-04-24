const cron = require("node-cron");
const Task = require("../models/task");
const mongoose = require("mongoose");

const getNextDate = (date, type) => {
  const d = new Date(date);
  if (type === "daily") d.setDate(d.getDate() + 1);
  if (type === "weekly") d.setDate(d.getDate() + 7);
  if (type === "monthly") d.setMonth(d.getMonth() + 1);
  return d;
};

const scheduleRecurringTasks = () => {
  cron.schedule("0 1 * * *", async () => {
    console.log("🔁 Checking recurring tasks...");

    const today = new Date();

    const recurringTasks = await Task.find({
      recurring: { $ne: "none" },
      dueDate: { $lt: today },
    });

    for (const task of recurringTasks) {
      const nextDate = getNextDate(task.dueDate, task.recurring);

      const newTask = new Task({
        title: task.title,
        description: task.description,
        dueDate: nextDate,
        priority: task.priority,
        status: "To Do",
        assignedTo: task.assignedTo,
        recurring: task.recurring,
        createdBy: task.createdBy,
      });

      await newTask.save();
      console.log(`🆕 Task "${task.title}" repeated for ${task.recurring}`);
    }
  });
};

module.exports = scheduleRecurringTasks;
