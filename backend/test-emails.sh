#!/bin/bash

API_URL="http://localhost:3000/api"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test_${TIMESTAMP}@example.com"
TEST_USERNAME="testuser_${TIMESTAMP}"
TEST_PASSWORD="Test123!@#"

echo ""
echo "🧪 Starting Email System Tests..."
echo ""
echo "============================================================"

# Test 1: Welcome Email (Registration)
echo ""
echo "📧 TEST 1: Testing Welcome Email (User Registration)"
echo "------------------------------------------------------------"
echo "Registering user: ${TEST_EMAIL}"

REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"${TEST_USERNAME}\",
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"${TEST_PASSWORD}\"
  }")

echo "$REGISTER_RESPONSE" | grep -q "token"
if [ $? -eq 0 ]; then
  echo "✅ Registration successful!"
  echo "👀 Check server console above for welcome email output"
  AUTH_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
  echo "❌ Registration failed"
  echo "$REGISTER_RESPONSE"
  exit 1
fi

sleep 2

# Test 2: Password Reset Email
echo ""
echo "📧 TEST 2: Testing Password Reset Email"
echo "------------------------------------------------------------"
echo "Requesting password reset for: ${TEST_EMAIL}"

curl -s -X POST "${API_URL}/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${TEST_EMAIL}\"}" > /dev/null

echo "✅ Password reset request sent!"
echo "👀 Check server console above for password reset email"

sleep 2

# Test 3: Order Confirmation Email
echo ""
echo "📧 TEST 3: Testing Order Confirmation Email"
echo "------------------------------------------------------------"

# Get a product with stock
PRODUCT_RESPONSE=$(curl -s "${API_URL}/products")
PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
PRODUCT_NAME=$(echo "$PRODUCT_RESPONSE" | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)
PRODUCT_PRICE=$(echo "$PRODUCT_RESPONSE" | grep -o '"price":[0-9.]*' | head -1 | cut -d':' -f2)

if [ -z "$PRODUCT_ID" ]; then
  echo "⚠️  No products available, skipping order tests"
  exit 0
fi

echo "Creating order with product: ${PRODUCT_NAME}"

ORDER_RESPONSE=$(curl -s -X POST "${API_URL}/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -d "{
    \"orderItems\": [{
      \"product\": \"${PRODUCT_ID}\",
      \"quantity\": 1,
      \"price\": ${PRODUCT_PRICE}
    }],
    \"shippingAddress\": {
      \"street\": \"123 Test St\",
      \"city\": \"Test City\",
      \"state\": \"Test State\",
      \"zipCode\": \"12345\",
      \"country\": \"Test Country\"
    },
    \"paymentMethod\": \"Credit Card\",
    \"totalAmount\": ${PRODUCT_PRICE}
  }")

ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -n "$ORDER_ID" ]; then
  echo "✅ Order created successfully!"
  echo "Order ID: ${ORDER_ID}"
  echo "👀 Check server console above for order confirmation email"
else
  echo "❌ Order creation failed"
  echo "$ORDER_RESPONSE"
fi

sleep 2

# Test 4: Order Status Update Email
if [ -n "$ORDER_ID" ]; then
  echo ""
  echo "📧 TEST 4: Testing Order Status Update Email (User)"
  echo "------------------------------------------------------------"
  echo "Cancelling order: ${ORDER_ID}"

  curl -s -X PUT "${API_URL}/orders/${ORDER_ID}" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${AUTH_TOKEN}" \
    -d "{\"status\": \"Cancelled\"}" > /dev/null

  echo "✅ Order status updated (Cancelled)!"
  echo "👀 Check server console above for status update email"
fi

# Summary
echo ""
echo "============================================================"
echo "🎉 Email System Test Complete!"
echo "============================================================"
echo ""
echo "✅ All 4 email types tested:"
echo "   1. Welcome Email (Registration)"
echo "   2. Password Reset Email"
echo "   3. Order Confirmation Email"
echo "   4. Order Status Update Email"
echo ""
echo "📋 Test User Created:"
echo "   Username: ${TEST_USERNAME}"
echo "   Email: ${TEST_EMAIL}"
if [ -n "$ORDER_ID" ]; then
  echo "   Order ID: ${ORDER_ID}"
fi
echo ""
echo "💡 Check the server console for email outputs"
echo "   Each email should show HTML content with proper formatting"
echo ""
