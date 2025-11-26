const express = require("express");
const { uploadImage, uploadDocument } = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Upload single image
router.post(
  "/image",
  authMiddleware,
  adminMiddleware,
  uploadImage.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/images/${req.file.filename}`;

      res.status(200).json({
        message: "Image uploaded successfully",
        filename: req.file.filename,
        url: fileUrl,
        path: req.file.path,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  }
);

// Upload multiple images
router.post(
  "/images",
  authMiddleware,
  adminMiddleware,
  uploadImage.array("images", 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const files = req.files.map((file) => ({
        filename: file.filename,
        url: `/uploads/images/${file.filename}`,
        path: file.path,
      }));

      res.status(200).json({
        message: "Images uploaded successfully",
        count: files.length,
        files: files,
      });
    } catch (error) {
      console.error("Images upload error:", error);
      res.status(500).json({ message: "Failed to upload images" });
    }
  }
);

// Upload single document
router.post(
  "/document",
  authMiddleware,
  adminMiddleware,
  uploadDocument.single("document"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/documents/${req.file.filename}`;

      res.status(200).json({
        message: "Document uploaded successfully",
        filename: req.file.filename,
        url: fileUrl,
        path: req.file.path,
        originalName: req.file.originalname,
      });
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  }
);

// Upload multiple documents
router.post(
  "/documents",
  authMiddleware,
  adminMiddleware,
  uploadDocument.array("documents", 5),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const files = req.files.map((file) => ({
        filename: file.filename,
        url: `/uploads/documents/${file.filename}`,
        path: file.path,
        originalName: file.originalname,
      }));

      res.status(200).json({
        message: "Documents uploaded successfully",
        count: files.length,
        files: files,
      });
    } catch (error) {
      console.error("Documents upload error:", error);
      res.status(500).json({ message: "Failed to upload documents" });
    }
  }
);

// Delete file
router.delete("/file", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { filename, type } = req.body;

    if (!filename || !type) {
      return res
        .status(400)
        .json({ message: "Filename and type are required" });
    }

    const uploadDir =
      type === "image"
        ? path.join(__dirname, "../../uploads/images")
        : path.join(__dirname, "../../uploads/documents");
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
});

// Get list of uploaded files
router.get("/files", authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { type } = req.query;

    const imagesDir = path.join(__dirname, "../../uploads/images");
    const documentsDir = path.join(__dirname, "../../uploads/documents");

    let files = [];

    if (!type || type === "image") {
      const imageFiles = fs.existsSync(imagesDir)
        ? fs.readdirSync(imagesDir).map((file) => ({
            filename: file,
            url: `/uploads/images/${file}`,
            type: "image",
            size: fs.statSync(path.join(imagesDir, file)).size,
          }))
        : [];
      files = [...files, ...imageFiles];
    }

    if (!type || type === "document") {
      const documentFiles = fs.existsSync(documentsDir)
        ? fs.readdirSync(documentsDir).map((file) => ({
            filename: file,
            url: `/uploads/documents/${file}`,
            type: "document",
            size: fs.statSync(path.join(documentsDir, file)).size,
          }))
        : [];
      files = [...files, ...documentFiles];
    }

    res.status(200).json({
      count: files.length,
      files: files,
    });
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ message: "Failed to get files" });
  }
});

// Handle multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size is too large" });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files" });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
