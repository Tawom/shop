const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./src/models/Product");

// Sample products data
const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 20-hour battery life. Perfect for music lovers and commuters.",
    price: 79.99,
    category: "Electronics",
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
  },
  {
    name: "Smart Watch Pro",
    description:
      "Feature-packed smartwatch with fitness tracking, heart rate monitor, and smartphone notifications.",
    price: 199.99,
    category: "Electronics",
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
  },
  {
    name: "Laptop Backpack",
    description:
      "Durable and spacious backpack with padded laptop compartment, fits up to 15.6 inch laptops.",
    price: 45.99,
    category: "Accessories",
    stock: 100,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
  },
  {
    name: "USB-C Hub Adapter",
    description:
      "7-in-1 USB-C hub with HDMI, USB 3.0 ports, SD card reader, and power delivery.",
    price: 34.99,
    category: "Electronics",
    stock: 75,
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=200&fit=crop",
  },
  {
    name: "Wireless Mouse",
    description:
      "Ergonomic wireless mouse with silent clicks and long battery life. Compatible with Windows and Mac.",
    price: 24.99,
    category: "Electronics",
    stock: 120,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop",
  },
  {
    name: "Mechanical Keyboard RGB",
    description:
      "Gaming mechanical keyboard with customizable RGB lighting and tactile switches.",
    price: 89.99,
    category: "Electronics",
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop",
  },
  {
    name: "Phone Case - Clear",
    description:
      "Ultra-thin transparent phone case with shock absorption. Available for various models.",
    price: 12.99,
    category: "Accessories",
    stock: 200,
    image:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=200&fit=crop",
  },
  {
    name: "Portable Phone Charger 10000mAh",
    description:
      "Compact power bank with dual USB ports and fast charging support.",
    price: 29.99,
    category: "Electronics",
    stock: 85,
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=200&fit=crop",
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat with extra cushioning, perfect for yoga, pilates, and fitness exercises.",
    price: 39.99,
    category: "Sports",
    stock: 60,
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=200&fit=crop",
  },
  {
    name: "Water Bottle Insulated",
    description:
      "Stainless steel water bottle keeps drinks cold for 24h or hot for 12h. BPA-free, 750ml capacity.",
    price: 27.99,
    category: "Sports",
    stock: 90,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=200&fit=crop",
  },
  {
    name: "Running Shoes Men",
    description:
      "Lightweight running shoes with breathable mesh and cushioned sole. Available in multiple colors.",
    price: 69.99,
    category: "Sports",
    stock: 55,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
  },
  {
    name: "Coffee Maker Programmable",
    description:
      "12-cup programmable coffee maker with auto shut-off and reusable filter.",
    price: 54.99,
    category: "Home & Kitchen",
    stock: 35,
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=200&fit=crop",
  },
  {
    name: "Desk Lamp LED",
    description:
      "Adjustable LED desk lamp with touch control and USB charging port. Energy efficient.",
    price: 32.99,
    category: "Home & Kitchen",
    stock: 70,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=200&fit=crop",
  },
  {
    name: "Notebook Set - 3 Pack",
    description:
      "Set of 3 hardcover notebooks with dotted pages. Perfect for journaling and note-taking.",
    price: 18.99,
    category: "Stationery",
    stock: 150,
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&h=200&fit=crop",
  },
  {
    name: "Gel Pens Assorted Colors - 12 Pack",
    description:
      "Smooth writing gel pens in vibrant colors. Quick-drying ink, comfortable grip.",
    price: 9.99,
    category: "Stationery",
    stock: 180,
    image:
      "https://images.unsplash.com/photo-1586281010691-9aa5e3f6aa88?w=300&h=200&fit=crop",
  },
];

// Connect to database and seed products
const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // Clear existing products (optional - comment out if you want to keep existing data)
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`${insertedProducts.length} products inserted successfully`);

    console.log("\nSample products:");
    insertedProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} - $${product.price} (${
          product.category
        })`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
