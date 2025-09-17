const express = require("express");
const router = express.Router();
const { getAllMaterialStocks } = require("../Controllers/MaterialStockControllers");

router.get("/", getAllMaterialStocks); // GET all material stock

module.exports = router;

