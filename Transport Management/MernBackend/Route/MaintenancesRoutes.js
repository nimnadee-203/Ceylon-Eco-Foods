const express = require("express");
const router = express.Router();

const MaintenancesController = require("../Controllers/MaintenancesControllers");

// List + Create
router.get("/", MaintenancesController.getAllMaintenances);
router.post("/", MaintenancesController.addMaintenance);

// ✅ Confirm MUST come before "/:id"
router.get("/confirm/:id", MaintenancesController.confirmMaintenance);

// Single
router.get("/:id", MaintenancesController.getById);
router.put("/:id", MaintenancesController.updateMaintenance);
router.delete("/:id", MaintenancesController.deleteMaintenance);

module.exports = router;
