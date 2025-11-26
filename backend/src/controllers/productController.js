const Product = require("../models/Product");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Search if search term provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price, and category are required",
      });
    }

    // Validate price
    if (price < 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    // Validate stock
    if (stock && stock < 0) {
      return res.status(400).json({
        message: "Stock must be a positive number",
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image: image || "https://via.placeholder.com/300x200?text=Product",
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages,
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image, isActive } =
      req.body;

    // Find product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate price if provided
    if (price !== undefined && price < 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    // Validate stock if provided
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        message: "Stock must be a positive number",
      });
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (image !== undefined) product.image = image;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages,
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    await product.save();

    res.json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Hard delete product (permanently remove)
const hardDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product permanently deleted",
      product,
    });
  } catch (error) {
    console.error("Hard delete product error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  getCategories,
};
