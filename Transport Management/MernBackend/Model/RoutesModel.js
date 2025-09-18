const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
  routeId: {
    type: String,
    required: true,
    unique: true,
    default: () => `ROU-${Date.now()}` // Auto-generate like VEH-
  },
  routeName: {
    type: String,
    required: true
  },
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  totalDistance: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active','Inactive','Maintenance'],
    default: 'Active'
  }
});

module.exports = mongoose.model("Route", RouteSchema);
