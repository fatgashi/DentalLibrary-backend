const express = require('express');
const StatisticsController = require('../controllers/StatisticsController');
const { isAdmin } = require('../middlewares/authorization');

const statisticsRouter = express.Router();

statisticsRouter.post('/record-visit', StatisticsController.recordVisitors);
statisticsRouter.get('/visitor-count', isAdmin, StatisticsController.visitorCount);
statisticsRouter.get('/get-sales', isAdmin, StatisticsController.sales);
statisticsRouter.get('/get-todaySales', StatisticsController.todaySales);

module.exports = statisticsRouter;