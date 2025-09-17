const MaterialStock = require("../Model/MaterialStockModel");

// Get all material stocks
const getAllMaterialStocks = async (req, res) => {
  try {
    const materialStocks = await MaterialStock.find();
    res.status(200).json({ materialStocks }); // frontend expects key: materialStocks
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Deduct stock when approving production request
const deductStock = async (productName, quantity) => {
  const stock = await MaterialStock.findOne({ productName });
  if (!stock || stock.totalQuantity < quantity) {
    throw new Error("Not enough stock");
  }
  stock.totalQuantity -= quantity;
  await stock.save();
  return stock;
};

module.exports = { getAllMaterialStocks, deductStock };
