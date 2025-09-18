const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
  driverId: {
    type: String,
    required: true,
    unique: true,
    default: () => `DRV-${Date.now()}`
  },
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
  hireDate: { type: Date, required: true },
  salary: { type: Number, required: true }
});

module.exports = mongoose.model("Driver", DriverSchema);
