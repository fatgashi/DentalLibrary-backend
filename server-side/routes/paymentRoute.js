const express = require('express');
const PaymentController = require('../controllers/PaymentController');

const paymentRouter = express.Router();

paymentRouter.post('/create-checkout-session', PaymentController.createCheckoutSession);

module.exports = paymentRouter;