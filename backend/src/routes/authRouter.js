const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require("../controllers/authController");
const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Forgot password route
router.post("/forgot-password", forgotPassword);

// Reset password route
router.post("/reset-password/:token", resetPassword);

// Verify reset token route
router.get("/verify-reset-token/:token", verifyResetToken);

module.exports = router;
