const express = require("express");
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

// Create new order
router.post("/", createOrder);

// Get logged in user orders
router.get("/my-orders", getMyOrders);

// Get order by ID
router.get("/:id", getOrderById);

// Update order to paid
router.put("/:id/pay", updateOrderToPaid);

// Update order status
router.put("/:id/status", updateOrderStatus);

// Cancel order
router.put("/:id/cancel", cancelOrder);

module.exports = router;
