const express = require("express");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
} = require("../controllers/order.controller");

const router = express.Router();

/*
 * Routes client
 */
router.post("/", auth, createOrder);
router.get("/my-orders", auth, getMyOrders);
router.get("/my-orders/:id", auth, getMyOrderById);

/*
 * Routes administration
 */
router.get("/admin", auth, admin, getAdminOrders);
router.get("/admin/:id", auth, admin, getAdminOrderById);
router.patch(
  "/admin/:id/status",
  auth,
  admin,
  updateOrderStatus,
);

module.exports = router;