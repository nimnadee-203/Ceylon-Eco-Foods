const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MaintenanceSchema = new Schema({
  maintenanceId: {
    type: String,
    required: true,
    unique: true,
    default: () => `MAIN-${Date.now()}` // Auto-generate ID
  },
  vehicleNumber: { type: String, required: true },

  // 🔗 Link to Driver
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true
  },

  type: {
    type: String,
    enum: ["Repair", "Service", "Inspection"],
    required: true
  },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed"],
    default: "Scheduled"
  },
  scheduledDate: { type: Date, required: true },
  completedDate: { type: Date },

  // ✅ Driver confirmation
  confirmed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
