const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true }, // Add customer email for filtering
  date: { type: Date, required: true },
  products: { type: [String], required: true }, // keep existing
  quantities: { type: [Number], required: true }, // <-- new field
  total: { type: Number, required: true },
  orderstatus: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  deliveryMethod: { type: String, enum: ["Pickup", "Home Delivery"], default: "Home Delivery" }
});

module.exports = mongoose.model(
  "Order", // model name
  orderSchema
);
