const express = require("express");
const router = express.Router();

const ProductionStockController = require("../Controllers/ProductionStockControllers");

// Routes
router.get("/", ProductionStockController.getAllProductionStocks);
router.post("/", ProductionStockController.addProductionStocks);
router.get("/:id", ProductionStockController.getById);
router.put("/:id", ProductionStockController.updateProductionStock);
router.delete("/:id", ProductionStockController.deleteProductionStock);

module.exports = router;
