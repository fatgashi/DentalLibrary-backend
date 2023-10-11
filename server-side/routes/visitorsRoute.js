const express = require('express');
const VisitorsController = require('../controllers/VisitorsController');
const { isAdmin } = require('../middlewares/authorization');

const visitorRouter = express.Router();

visitorRouter.post('/record-visit', VisitorsController.recordVisitors);
visitorRouter.get('/visitor-count', isAdmin, VisitorsController.visitorCount);

module.exports = visitorRouter;