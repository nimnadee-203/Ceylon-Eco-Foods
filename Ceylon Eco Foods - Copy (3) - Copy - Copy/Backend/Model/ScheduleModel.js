const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  employee: [{ type: String, required: true }], // Changed to match DailyTarget model structure
  task: { type: String, required: true }, // Added missing task field
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  shiftType: { type: String, enum: ["Morning", "Evening", "Night"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("Schedule", ScheduleSchema);
