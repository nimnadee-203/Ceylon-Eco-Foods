const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true });

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
