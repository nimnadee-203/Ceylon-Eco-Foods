const express = require("express");
const {
  getMetrics,
  getDeliveriesPerMonth,
  getVehicleStatus,
  getDriverStatus,
  getRecentDeliveries,
  getMaintenanceHistory,
  getRoutesOverview,
} = require("../Controllers/DashboardControllers");

const router = express.Router();

router.get("/metrics", getMetrics);
router.get("/deliveries-per-month", getDeliveriesPerMonth);
router.get("/vehicle-status", getVehicleStatus);
router.get("/driver-status", getDriverStatus);
router.get("/recent-deliveries", getRecentDeliveries);
router.get("/maintenances-history", getMaintenanceHistory);
router.get("/routes-overview", getRoutesOverview);

module.exports = router;
