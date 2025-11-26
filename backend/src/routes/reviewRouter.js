const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Product review routes
router.get("/products/:productId/reviews", getProductReviews);
router.post("/products/:productId/reviews", authMiddleware, createReview);

// Review management routes
router.put("/reviews/:id", authMiddleware, updateReview);
router.delete("/reviews/:id", authMiddleware, deleteReview);

module.exports = router;
