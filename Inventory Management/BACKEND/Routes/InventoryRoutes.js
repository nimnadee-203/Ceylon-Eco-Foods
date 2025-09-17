const express = require("express");
const router = express.Router();

const Inventory = require("../Model/InventoryModel");

const InventoryController = require("../Controllers/InventoryControllers");

router.get("/",InventoryController.getAllInventories);
router.post("/",InventoryController.addInventories);
router.get("/:id",InventoryController.getById);
router.put("/:id",InventoryController.updateInventory);
router.delete("/:id",InventoryController.deleteInventory);

module.exports = router;
