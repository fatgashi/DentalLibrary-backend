const express = require('express');
const EmailDiscount = require('../controllers/EmailDiscount');


const emailsRoute = express.Router();


emailsRoute.post('/collect-email', EmailDiscount.collectEmail);

module.exports = emailsRoute;

