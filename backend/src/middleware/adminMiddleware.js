// Middleware to check if user has admin role
const adminMiddleware = (req, res, next) => {
  try {
    // Check if user is authenticated (authMiddleware should run first)
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = adminMiddleware;
