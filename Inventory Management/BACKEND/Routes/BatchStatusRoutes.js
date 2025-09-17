const express = require("express");
const router = express.Router();
const BatchStatusControllers = require("../Controllers/BatchStatusControllers");

// Get all batch statuses
router.get("/", BatchStatusControllers.getAllBatchStatus);

// Update used quantity manually
router.put("/update/:batchId", BatchStatusControllers.updateBatchUsage);

// Soft delete batch
router.put("/delete/:batchId", BatchStatusControllers.deleteBatch);

// Approve production request with batch number
router.put("/approveWithBatch", BatchStatusControllers.approveWithBatch);

module.exports = router;
