// BACKEND/Model/SubmissionModel.js
const mongoose = require('mongoose');

const SubmissionItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 0 },
  price: { type: Number, default: 0 }
});

const SubmissionSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'RequestModel', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'SupplierModel', required: true },
  items: { type: [SubmissionItemSchema], required: true },
  notes: { type: String, default: '' },

  // money fields (LKR)
  supplierAmount: { type: Number, default: 0 }, // supplier requested total
  paidAmount: { type: Number, default: 0 },     // admin-paid amount

  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubmissionModel', SubmissionSchema);
