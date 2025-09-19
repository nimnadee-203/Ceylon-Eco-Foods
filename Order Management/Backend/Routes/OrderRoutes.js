const express = require("express");
const router = express.Router();

const OrderController = require("../Controllers/OrderController");

// Routes
router.get("/", OrderController.getAllOrders);
router.post("/", OrderController.addOrders);
router.get("/:id", OrderController.getById);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
