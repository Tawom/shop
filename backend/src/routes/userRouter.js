const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get("/profile", getProfile);

// Update user profile
router.put("/profile", updateProfile);

// Change password
router.put("/password", changePassword);

// Delete account
router.delete("/account", deleteAccount);

module.exports = router;
