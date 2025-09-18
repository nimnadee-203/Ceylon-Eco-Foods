const express = require("express");
const router = express.Router();



// Importing the Drivers controller
const DriversController = require("../Controllers/DriversControllers");

router.get("/", DriversController.getAllDrivers);
router.post("/", DriversController.addDriver);
router.get("/:id", DriversController.getDriverById);
router.put("/:id", DriversController.updateDriver);
router.delete("/:id", DriversController.deleteDriver);

module.exports = router;
