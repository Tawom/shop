const axios = require("axios");

const API_URL = "http://localhost:3000/api";

// Test data
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: "Test123!@#",
};

let authToken = "";
let userId = "";
let orderId = "";

// Helper function to add delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testEmailSystem() {
  console.log("\n🧪 Starting Email System Tests...\n");
  console.log("=".repeat(60));

  try {
    // Test 1: Welcome Email (Registration)
    console.log("\n📧 TEST 1: Testing Welcome Email (User Registration)");
    console.log("-".repeat(60));
    console.log(`Registering user: ${testUser.email}`);

    const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
    authToken = registerRes.data.token;
    userId = registerRes.data.user._id;

    console.log("✅ Registration successful!");
    console.log("👀 Check server console for welcome email output\n");

    await delay(2000);

    // Test 2: Password Reset Email
    console.log("\n📧 TEST 2: Testing Password Reset Email");
    console.log("-".repeat(60));
    console.log(`Requesting password reset for: ${testUser.email}`);

    await axios.post(`${API_URL}/auth/forgot-password`, {
      email: testUser.email,
    });

    console.log("✅ Password reset request sent!");
    console.log("👀 Check server console for password reset email\n");

    await delay(2000);

    // Test 3: Order Confirmation Email
    console.log("\n📧 TEST 3: Testing Order Confirmation Email");
    console.log("-".repeat(60));

    // Get a product first
    const productsRes = await axios.get(`${API_URL}/products`);
    const product = productsRes.data.products.find((p) => p.stock > 0);

    if (!product) {
      console.log("⚠️  No products with stock available, skipping order tests");
      return;
    }

    console.log(`Creating order with product: ${product.name}`);

    const orderData = {
      orderItems: [
        {
          product: product._id,
          quantity: 1,
          price: product.price,
        },
      ],
      shippingAddress: {
        street: "123 Test St",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "Test Country",
      },
      paymentMethod: "Credit Card",
      totalAmount: product.price,
    };

    const orderRes = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    orderId = orderRes.data._id;

    console.log("✅ Order created successfully!");
    console.log(`Order ID: ${orderId}`);
    console.log("👀 Check server console for order confirmation email\n");

    await delay(2000);

    // Test 4: Order Status Update Email (User Update)
    console.log("\n📧 TEST 4: Testing Order Status Update Email (User)");
    console.log("-".repeat(60));
    console.log(`Cancelling order: ${orderId}`);

    await axios.put(
      `${API_URL}/orders/${orderId}`,
      { status: "Cancelled" },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    console.log("✅ Order status updated (Cancelled)!");
    console.log("👀 Check server console for status update email\n");

    await delay(2000);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 Email System Test Complete!");
    console.log("=".repeat(60));
    console.log("\n✅ All 4 email types tested:");
    console.log("   1. Welcome Email (Registration)");
    console.log("   2. Password Reset Email");
    console.log("   3. Order Confirmation Email");
    console.log("   4. Order Status Update Email");
    console.log("\n📋 Test User Created:");
    console.log(`   Username: ${testUser.username}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Order ID: ${orderId}`);
    console.log("\n💡 Check the server console above for email outputs");
    console.log(
      "   Each email should show HTML content with proper formatting\n"
    );
  } catch (error) {
    console.error("\n❌ Test Error:", error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error("Validation Errors:", error.response.data.errors);
    }
  }
}

// Run tests
testEmailSystem();
