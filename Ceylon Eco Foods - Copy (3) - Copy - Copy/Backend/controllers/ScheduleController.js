const Schedule = require("../Model/ScheduleModel");

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json({ schedules });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add schedule
exports.addSchedule = async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    const saved = await schedule.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get by ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json(schedule);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// Delete
exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
