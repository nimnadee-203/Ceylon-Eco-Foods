const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ProductController = require("../Controllers/ProductController");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
router.get("/", ProductController.getAllProducts);
router.post("/", upload.single("image"), ProductController.addProduct); // add product with image
router.get("/:id", ProductController.getProductById);
router.put("/:id", upload.single("image"), ProductController.updateProduct); // update product with optional image
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
