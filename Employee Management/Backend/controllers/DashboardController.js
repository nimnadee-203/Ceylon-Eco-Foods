const Employee = require("../Model/EmployeeModel");
const DailyTarget = require("../Model/DailyTargetModel");  // <-- ඔබේ model name
const Schedule = require("../Model/ScheduleModel");        // <-- ඔබේ model name

exports.getDashboardSummary = async (req, res) => {
    try {
        const employeeCount = await Employee.countDocuments();
        const scheduleCount = await Schedule.countDocuments();
        const targetCount = await DailyTarget.countDocuments();

        res.json({
            employeeCount,
            scheduleCount,
            targetCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching dashboard summary" });
    }
};
