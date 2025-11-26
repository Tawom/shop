const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./src/config/database");
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRouter = require("./src/routes/authRouter.js");
const productRouter = require("./src/routes/productRouter.js");
const userRouter = require("./src/routes/userRouter.js");
const orderRouter = require("./src/routes/orderRouter.js");
const adminRouter = require("./src/routes/adminRouter.js");
const uploadRouter = require("./src/routes/uploadRouter.js");
const reviewRouter = require("./src/routes/reviewRouter.js");
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadRouter);
app.use("/api", reviewRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "E-Commerce API is running!" });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});
