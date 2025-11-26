const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendEmail } = require("../config/email");

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    // Validate order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Verify products exist and have sufficient stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`,
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          message: `Product is no longer available: ${item.name}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Calculate total price
    order.calculateTotalPrice();

    // Save order
    const createdOrder = await order.save();

    // Update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // Populate order with user details for email
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate("user", "username email")
      .populate("orderItems.product", "name category");

    // Send order confirmation email
    const user = await User.findById(req.user.id);
    sendEmail(user.email, "orderConfirmation", { order: populatedOrder, user });

    res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("orderItems.product", "name category");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findByUser(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order to paid
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      emailAddress: req.body.payer?.email_address,
    };
    order.status = "Processing";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Update order to paid error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    if (
      !["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(
        status
      )
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Send order status update email
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("user", "username email")
      .populate("orderItems.product", "name category");
    const user = populatedOrder.user;
    sendEmail(user.email, "orderStatusUpdate", { order: populatedOrder, user });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Can only cancel pending orders
    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Can only cancel pending orders",
      });
    }

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = "Cancelled";
    const updatedOrder = await order.save();

    res.json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderStatus,
  cancelOrder,
};
