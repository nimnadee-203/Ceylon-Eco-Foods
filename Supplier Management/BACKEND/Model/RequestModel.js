// BACKEND/Model/RequestModel.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 }
});

const RequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  items: { type: [ItemSchema], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SupplierModel' }, // admin user id
  status: { type: String, enum: ['open','partially_supplied','supplied','closed'], default: 'open' },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RequestModel', RequestSchema);
