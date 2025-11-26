const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price must be positive"],
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, "Full name is required"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["Credit Card", "PayPal", "Cash on Delivery"],
      default: "Cash on Delivery",
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Instance method to calculate total price
orderSchema.methods.calculateTotalPrice = function () {
  this.itemsPrice = this.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  this.totalPrice = this.itemsPrice + this.shippingPrice + this.taxPrice;
  return this.totalPrice;
};

// Static method to get user orders
orderSchema.statics.findByUser = function (userId) {
  return this.find({ user: userId })
    .populate("user", "username email")
    .populate("orderItems.product", "name category")
    .sort({ createdAt: -1 });
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);
  return stats;
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
