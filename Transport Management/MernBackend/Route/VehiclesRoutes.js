const express = require("express");
const router = express.Router();


// Insert controller
const VehiclesController = require("../Controllers/VehiclesControllers");

// Routes
router.get("/", VehiclesController.getAllVehicles);
router.post("/", VehiclesController.addVehicle);
router.get("/:id", VehiclesController.getById);
router.put("/:id", VehiclesController.updateVehicle);
router.delete("/:id", VehiclesController.deleteVehicle);

// export 
module.exports = router;