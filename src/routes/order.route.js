const express = require("express");
const router = express.Router();
const {authenticate,authorizeRole} = require("../middlewares/authenticate");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/order.controller");

router.route("/order/new").post(authenticate,newOrder);
router.route("/order/:id").get(authenticate,getSingleOrder)
router.route("/orders/me").get(authenticate,myOrders);
router.route("/admin/orders").get(authenticate,authorizeRole("admin"),getAllOrders);
router.route("/admin/order/:id").put(authenticate,authorizeRole("admin"),updateOrderStatus).delete(authenticate,authorizeRole("admin"),deleteOrder);
module.exports = router;