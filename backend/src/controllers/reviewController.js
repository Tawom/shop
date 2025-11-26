const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId })
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ product: productId });

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment is required" });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment: comment.trim(),
    });

    // Update product rating and review count
    await updateProductRating(productId);

    // Populate user info before sending response
    await review.populate("user", "username");

    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Update review
    if (rating) review.rating = rating;
    if (comment) review.comment = comment.trim();

    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    await review.populate("user", "username");

    res.json(review);
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== userId.toString() && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(id);

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });

    const numReviews = reviews.length;
    const rating =
      numReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews
        : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(rating * 10) / 10, // Round to 1 decimal place
      numReviews,
    });
  } catch (error) {
    console.error("Update product rating error:", error);
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
