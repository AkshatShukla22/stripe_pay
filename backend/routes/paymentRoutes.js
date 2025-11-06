const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.get('/orders', paymentController.getOrders);

module.exports = router;