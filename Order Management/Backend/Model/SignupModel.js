// SignupModel.js
const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // prevent duplicate emails
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // automatically adds createdAt & updatedAt

const SignupModel = mongoose.model("Customer", signupSchema);

module.exports = SignupModel;
