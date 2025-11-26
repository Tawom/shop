const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Debug: Check if MONGODB_URI is loaded
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log(
      "MONGODB_URI starts with:",
      process.env.MONGODB_URI?.substring(0, 20)
    );

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined!");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
