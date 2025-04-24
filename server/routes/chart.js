const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const chartController = require('../controllers/chart.js');
const isAdmin = require('../middleware/isAdmin.js');

router.get('/summary',
    isAdmin,
    chartController.getDashboardSummary
);
router.get('/taskstatuscounts',
    isAdmin,
    chartController.getTaskStatusCounts
);
router.get('/daily-task-stats',
    isAdmin,
    chartController.getDailyTaskStats
);
router.get('/task-priority-stats',
    isAdmin,
    chartController.getTaskPriorityStats
);
router.get('/user-task-counts',
    isAdmin,
    chartController.getUserTaskCounts
);

module.exports = router;