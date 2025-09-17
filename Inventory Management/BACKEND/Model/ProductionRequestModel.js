// backend/Model/ProductionRequestModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productionRequestSchema = new Schema({
  RequestNo: { type: String, required: true },
  Material: { 
    type: String, 
    required: true,
    set: (v) => v.trim().toLowerCase(), // ✅ normalize
  },
  Quantity: { type: Number, required: true },
  RequestedBy: { type: String, required: true },
  RequestedDate: { type: Date, required: true },
  RequirementCondition: { type: String, required: true },
  Note: { type: String, required: true },
  Status: { type: String, default: "Pending" }  // approve/deny status
});

module.exports = mongoose.model("ProductionRequest", productionRequestSchema);
