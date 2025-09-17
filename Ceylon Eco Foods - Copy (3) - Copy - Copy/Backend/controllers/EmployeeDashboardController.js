const DailyTarget = require("../Model/DailyTargetModel");
const Schedule = require("../Model/ScheduleModel");

exports.getEmployeeTargets = async (req, res) => {
  try {
    const employeeEmail = req.params.employeeEmail;
    const targets = await DailyTarget.find({ employee: { $in: [employeeEmail] } });
    res.json({ targets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmployeeSchedules = async (req, res) => {
  try {
    const employeeEmail = req.params.employeeEmail;
    const schedules = await Schedule.find({ employee: { $in: [employeeEmail] } });
    res.json({ schedules });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
