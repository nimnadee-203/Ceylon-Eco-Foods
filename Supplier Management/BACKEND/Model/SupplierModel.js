// BACKEND/Model/SupplierModel.js
const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  supplies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Supply' }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  ratings: [{
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  }],
  earnings: { type: Number, default: 0 },        // Total confirmed payments (LKR)
  pendingPayments: { type: Number, default: 0 }, // Amount awaiting admin payment (LKR)
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['supplier','admin'], default: 'supplier' }
});

module.exports = mongoose.model('SupplierModel', SupplierSchema);
