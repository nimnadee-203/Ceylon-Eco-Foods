const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/DashboardController");

router.get("/summary", DashboardController.getDashboardSummary);

module.exports = router;
