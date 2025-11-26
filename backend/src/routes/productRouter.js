const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  getCategories,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all categories
router.get("/categories", getCategories);

// Get all products
router.get("/", getAllProducts);

// Get single product
router.get("/:id", getProductById);

// Create new product (admin only)
router.post("/", authMiddleware, adminMiddleware, createProduct);

// Update product (admin only)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// Delete product - soft delete (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

// Hard delete product (admin only)
router.delete("/:id/hard", authMiddleware, adminMiddleware, hardDeleteProduct);

module.exports = router;
