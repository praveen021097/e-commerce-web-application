const express = require("express");
const router = express.Router();
const {authenticate,authorizeRole} = require("../middlewares/authenticate");
const { newOrder } = require("../controllers/order.controller");

router.route("/order/new").post(authenticate,authorizeRole,newOrder)

module.exports = router;