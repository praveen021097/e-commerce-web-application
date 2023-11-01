const express = require("express");
const router = express.Router();

const {authenticate} = require("../middlewares/authenticate");
const { processPayment, sendStripeApiKey } = require("../controllers/payment.controller");
router.route("/payment/process").post(authenticate,processPayment);
router.route("/stripeApiKey").get(authenticate,sendStripeApiKey);
module.exports = router