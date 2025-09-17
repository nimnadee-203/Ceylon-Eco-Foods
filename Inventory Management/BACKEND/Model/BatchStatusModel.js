const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchStatusSchema = new Schema({
  batchId: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
  usedQuantity: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BatchStatus", batchStatusSchema);
