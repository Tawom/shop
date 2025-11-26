const mongoose = require("mongoose");

// Define Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [100, "Product name must not exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description must not exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock must be a positive number"],
      default: 0,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Product",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Instance method to get product with formatted price
productSchema.methods.toJSON = function () {
  const productObject = this.toObject();
  delete productObject.__v;
  return productObject;
};

// Static method to find products by category
productSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true });
};

// Static method to search products
productSchema.statics.searchProducts = function (searchTerm) {
  return this.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ],
    isActive: true,
  });
};

// Static method to find active products
productSchema.statics.findActiveProducts = function () {
  return this.find({ isActive: true });
};

// Static method to get all categories
productSchema.statics.getCategories = async function () {
  const categories = await this.distinct("category");
  return categories;
};

// Create and export the model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
