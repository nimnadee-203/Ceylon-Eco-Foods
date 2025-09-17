const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const materialStockSchema = new Schema({
  productName: {
    type: String,
    required: true,
    unique: true, 
    set: (v) => v.trim().toLowerCase(), // ✅ normalize here
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("MaterialStock", materialStockSchema);

