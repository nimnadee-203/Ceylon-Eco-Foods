const express = require("express");
const router = express.Router();
const EmployeeDashboardController = require("../controllers/EmployeeDashboardController");

router.get("/targets/:employeeEmail", EmployeeDashboardController.getEmployeeTargets);
router.get("/schedules/:employeeEmail", EmployeeDashboardController.getEmployeeSchedules);


module.exports = router;
