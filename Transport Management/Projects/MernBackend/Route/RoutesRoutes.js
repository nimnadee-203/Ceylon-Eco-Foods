const express = require("express");
const router = express.Router();

const RoutesController = require("../Controllers/RoutesControllers");

router.get("/", RoutesController.getAllRoutes);
router.post("/", RoutesController.addRoute);
router.get("/:id", RoutesController.getRouteById);
router.put("/:id", RoutesController.updateRoute);
router.delete("/:id", RoutesController.deleteRoute);

module.exports = router;
