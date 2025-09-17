const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  productName: {
    type: String,
    required: true,
    set: (v) => v.trim().toLowerCase(),  // ✅ normalize here
  },
  BatchNumber: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Unit: {
    type: String,
    required: true,
  },
  Supplier: {
    type: String,
    required: true,
  },
  CreatedDate: {
    type: Date,
    default: Date.now,  // auto-set when new entry is created
  },
  ExpiryDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Inventory", inventorySchema);
