const ProductionStock = require("../Model/ProductionStockModel");

// Get all production stocks
const getAllProductionStocks = async (req, res, next) => {
  let productionStocks;
  try {
    productionStocks = await ProductionStock.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!productionStocks) {
    return res.status(404).json({ message: "ProductionStocks not found" });
  }

  return res.status(200).json({ productionStocks });
};

// Add new production stock
const addProductionStocks = async (req, res, next) => {
  const { RequestNo, Material,Quantity,RequestedBy, RequestedDate, RequirementCondition,Note } = req.body;

  let productionStock;
  try {
    productionStock = new ProductionStock({
      RequestNo, 
      Material,
      Quantity,
      RequestedBy, 
      RequestedDate,
       RequirementCondition,
       Note,
    });
    await productionStock.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  return res.status(201).json({ productionStock });
};

// Get by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  let productionStock;

  try {
    productionStock = await ProductionStock.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!productionStock) {
    return res.status(404).json({ message: "ProductionStock not found" });
  }

  return res.status(200).json({ productionStock });
};

// Update production stock
const updateProductionStock = async (req, res, next) => {
  const id = req.params.id;
  const {RequestNo, Material,Quantity,RequestedBy, RequestedDate, RequirementCondition,Note } = req.body;

  let productionStock;
  try {
    productionStock = await ProductionStock.findByIdAndUpdate(
      id,
      { RequestNo, Material,Quantity,RequestedBy, RequestedDate, RequirementCondition,Note },
      { new: true } // return updated document
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!productionStock) {
    return res.status(404).json({ message: "Unable to update ProductionStock" });
  }

  return res.status(200).json({ productionStock });
};

// Delete production stock
const deleteProductionStock = async (req, res, next) => {
  const id = req.params.id;
  let productionStock;

  try {
    productionStock = await ProductionStock.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!productionStock) {
    return res.status(404).json({ message: "Unable to delete ProductionStock" });
  }

  return res.status(200).json({ productionStock });
};

module.exports = {
  getAllProductionStocks,
  addProductionStocks,
  getById,
  updateProductionStock,
  deleteProductionStock,
};

