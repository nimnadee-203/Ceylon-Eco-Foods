const Product = require("../Model/ProductModel");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error while fetching products", error: err.message });
  }
};

// Add a new product (with image upload)
const addProduct = async (req, res) => {
  const { productName, category, description, price, stock, units, status } = req.body;
  const image = req.file ? req.file.path : null;

  if (!image) return res.status(400).json({ message: "Image is required" });

  try {
    const product = new Product({ productName, category, description, price, stock, units, status, image });
    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error while adding product", error: err.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error while fetching product", error: err.message });
  }
};

// Update product (optional image upload)
const updateProduct = async (req, res) => {
  const { productName, category, description, price, stock, units, status } = req.body;
  const image = req.file ? req.file.path : undefined;

  const updateData = { productName, category, description, price, stock, units, status };
  if (image) updateData.image = image;

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: "Unable to update product" });
    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error while updating product", error: err.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Unable to delete product" });
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error while deleting product", error: err.message });
  }
};



module.exports = {
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
