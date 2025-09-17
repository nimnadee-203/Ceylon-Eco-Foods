const express = require("express");
const router = express.Router();
const ScheduleController = require("../controllers/ScheduleController");

// CRUD routes
router.get("/", ScheduleController.getAllSchedules);
router.post("/", ScheduleController.addSchedule);
router.get("/:id", ScheduleController.getScheduleById);
router.put("/:id", ScheduleController.updateSchedule);
router.delete("/:id", ScheduleController.deleteSchedule);

module.exports = router;
