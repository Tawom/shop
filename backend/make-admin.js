require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");

const makeAdmin = async (username) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User "${username}" not found`);
      console.log("\nAvailable users:");
      const users = await User.find({}).select("username email role");
      users.forEach((u) =>
        console.log(`  - ${u.username} (${u.email}) - Role: ${u.role}`)
      );
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`✓ User "${username}" is now an admin!`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

const username = process.argv[2];
if (!username) {
  console.log("Usage: node make-admin.js <username>");
  process.exit(1);
}

makeAdmin(username);
