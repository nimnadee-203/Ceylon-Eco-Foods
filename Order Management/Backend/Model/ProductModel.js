const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true }, // frontend dropdown handles options
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  units: { type: String, required: true },
  status: { type: String, required: true }, // frontend dropdown: "Available" / "Out of Stock"
  image: { type: String, required: true } // path to uploaded image
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
