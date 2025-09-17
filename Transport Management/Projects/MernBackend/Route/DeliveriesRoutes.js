const express = require("express");
const router  = express.Router();

//Insert controller
const DeliveriesController = require("../Controllers/DeliveriesControllers");

router.get("/",DeliveriesController.getAllDeliveries);
router.post("/",DeliveriesController.addDeliveries);
router.get("/:id",DeliveriesController.getById);
router.put("/:id",DeliveriesController.UpdateDeliveries);
router.delete("/:id",DeliveriesController.deleteDeliveries);


//export 
module.exports = router;
