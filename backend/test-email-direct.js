const { sendEmail } = require("./src/config/email");

console.log("\n🧪 Email Service Direct Test\n");
console.log("=".repeat(60));

// Test 1: Welcome Email
console.log("\n📧 TEST 1: Welcome Email Template");
console.log("-".repeat(60));

sendEmail("test@example.com", "welcome", {
  username: "John Doe",
  email: "test@example.com",
})
  .then(() => {
    console.log("\n");

    // Test 2: Password Reset Email
    console.log("📧 TEST 2: Password Reset Email Template");
    console.log("-".repeat(60));

    return sendEmail("test@example.com", "passwordReset", {
      username: "John Doe",
      resetUrl: "http://localhost:5173/reset-password/abc123token",
      resetToken: "abc123token",
    });
  })
  .then(() => {
    console.log("\n");

    // Test 3: Order Confirmation Email
    console.log("📧 TEST 3: Order Confirmation Email Template");
    console.log("-".repeat(60));

    return sendEmail("test@example.com", "orderConfirmation", {
      order: {
        _id: { toString: () => "674580b1234567890abcdef0" },
        totalAmount: 149.99,
        orderItems: [
          {
            product: { name: "Yoga Mat Premium", category: "Fitness" },
            quantity: 2,
            price: 49.99,
          },
          {
            product: { name: "Resistance Bands Set", category: "Fitness" },
            quantity: 1,
            price: 50.01,
          },
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "San Francisco",
          state: "CA",
          zipCode: "94102",
          country: "USA",
          address: "123 Main St",
          postalCode: "94102",
          phone: "555-1234",
        },
        createdAt: new Date(),
        totalPrice: 149.99,
      },
      user: {
        username: "John Doe",
      },
    });
  })
  .then(() => {
    console.log("\n");

    // Test 4: Order Status Update Email
    console.log("📧 TEST 4: Order Status Update Email Template");
    console.log("-".repeat(60));

    return sendEmail("test@example.com", "orderStatusUpdate", {
      order: {
        _id: { toString: () => "674580b1234567890abcdef0" },
        status: "Shipped",
        totalAmount: 149.99,
        createdAt: new Date(),
        totalPrice: 149.99,
      },
      user: {
        username: "John Doe",
      },
    });
  })
  .then(() => {
    console.log("\n" + "=".repeat(60));
    console.log("🎉 Email Template Test Complete!");
    console.log("=".repeat(60));
    console.log("\n✅ All 4 email templates tested successfully");
    console.log("📧 Emails logged to console (development mode)");
    console.log("\n💡 To send real emails:");
    console.log("   1. Set NODE_ENV=production in .env");
    console.log("   2. Configure SMTP credentials (Gmail, SendGrid, etc.)");
    console.log("   3. Restart server and test again\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error.message);
    console.error(error);
    process.exit(1);
  });
