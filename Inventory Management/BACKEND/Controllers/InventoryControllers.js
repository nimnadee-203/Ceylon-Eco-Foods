const Inventory = require("../Model/InventoryModel");
const MaterialStock = require("../Model/MaterialStockModel");

// Get all inventories
const getAllInventories = async (req, res, next) => {
  let inventories;
  try {
    inventories = await Inventory.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!inventories || inventories.length === 0) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  return res.status(200).json({ inventories });
};

// Add new inventory batch & update total stock
const addInventories = async (req, res, next) => {
  const { productName, BatchNumber, Quantity, Unit, Supplier, ExpiryDate } = req.body;

  let inventory;

  try {
    // Save inventory batch
    inventory = new Inventory({
      productName,
      BatchNumber,
      Quantity: Number(Quantity), // ensure numeric
      Unit,
      Supplier,
      CreatedDate: new Date(),
      ExpiryDate,
    });
    await inventory.save();

    // Update MaterialStock (total stock)
    let materialStock = await MaterialStock.findOne({ productName });

    if (materialStock) {
      // Update existing stock
      materialStock.totalQuantity += Number(Quantity); // ensure numeric addition
    } else {
      // Create new stock record
      materialStock = new MaterialStock({
        productName,
        totalQuantity: Number(Quantity),
        unit: Unit,
      });
    }
    await materialStock.save();

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to add inventory" });
  }

  return res.status(200).json({ inventory });
};

// Get inventory by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  let inventory;

  try {
    inventory = await Inventory.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!inventory) {
    return res.status(404).json({ message: "Inventory not found" });
  }
  return res.status(200).json({ inventory });
};

// Update Inventory batch (does not auto-update MaterialStock here)
const updateInventory = async (req, res, next) => {
  const id = req.params.id;
  const { productName, BatchNumber, Quantity, Unit, Supplier, ExpiryDate } = req.body;

  let inventory;

  try {
    inventory = await Inventory.findByIdAndUpdate(
      id,
      {
        productName,
        BatchNumber,
        Quantity: Number(Quantity), // ensure numeric
        Unit,
        Supplier,
        ExpiryDate,
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!inventory) {
    return res.status(404).json({ message: "Unable to update inventory" });
  }

  return res.status(200).json({ inventory });
};

// Delete Inventory batch (also deduct from MaterialStock)
const deleteInventory = async (req, res, next) => {
  const id = req.params.id;

  let inventory;
  try {
    inventory = await Inventory.findByIdAndDelete(id);

    if (inventory) {
      // Deduct from MaterialStock
      const materialStock = await MaterialStock.findOne({ productName: inventory.productName });
      if (materialStock) {
        materialStock.totalQuantity -= Number(inventory.Quantity); // ensure numeric subtraction
        if (materialStock.totalQuantity < 0) materialStock.totalQuantity = 0;
        await materialStock.save();
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete inventory" });
  }

  if (!inventory) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  return res.status(200).json({ inventory });
};

module.exports = {
  getAllInventories,
  addInventories,
  getById,
  updateInventory,
  deleteInventory,
};

