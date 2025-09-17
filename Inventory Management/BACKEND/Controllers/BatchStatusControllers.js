const BatchStatus = require("../Model/BatchStatusModel");
const Inventory = require("../Model/InventoryModel"); // Correct model import

// Get all batch statuses
const getAllBatchStatus = async (req, res) => {
  try {
    const statuses = await BatchStatus.find();
    res.status(200).json({ statuses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update used quantity (or create if not exists)
const updateBatchUsage = async (req, res) => {
  const { batchId } = req.params;
  const { usedQuantity } = req.body;

  try {
    let batch = await BatchStatus.findOne({ batchId });
    if (!batch) {
      batch = new BatchStatus({ batchId, usedQuantity });
    } else {
      batch.usedQuantity += usedQuantity;
      batch.lastUpdated = new Date();
    }
    await batch.save();
    res.status(200).json({ batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update batch usage" });
  }
};

// Soft delete batch
const deleteBatch = async (req, res) => {
  const { batchId } = req.params;

  try {
    let batch = await BatchStatus.findOne({ batchId });
    if (!batch) {
      batch = new BatchStatus({ batchId, isDeleted: true });
    } else {
      batch.isDeleted = true;
      batch.lastUpdated = new Date();
    }
    await batch.save();
    res.status(200).json({ batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete batch" });
  }
};

// Approve with batch number (validate batch quantity)
const approveWithBatch = async (req, res) => {
  const { batchNumber, quantity } = req.body;

  try {
    if (!batchNumber) return res.status(400).json({ message: "Batch number required" });

    // Find inventory with this batch number
    const inv = await Inventory.findOne({ BatchNumber: batchNumber });
    if (!inv) return res.status(404).json({ message: "Batch not found in inventory" });

    // Find or create batch status
    let batch = await BatchStatus.findOne({ batchId: inv._id });
    const usedQty = batch ? batch.usedQuantity : 0;
    const availableQty = inv.Quantity - usedQty;

    if (availableQty < quantity) {
      return res.status(400).json({
        message: `Insufficient quantity in batch ${batchNumber}. Available: ${availableQty}kg`,
      });
    }

    if (!batch) {
      batch = new BatchStatus({ batchId: inv._id, usedQuantity: quantity });
    } else {
      batch.usedQuantity += quantity;
      batch.lastUpdated = new Date();
      batch.isDeleted = false;
    }

    await batch.save();
    res.status(200).json({ batch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update batch status" });
  }
};

module.exports = {
  getAllBatchStatus,
  updateBatchUsage,
  deleteBatch,
  approveWithBatch,
};
