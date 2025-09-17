const express = require("express");
const router = express.Router();
const {
  getAllProductionRequests,
  addProductionRequest,
  updateRequestStatus,
  deleteProductionRequest, // ✅ new
} = require("../Controllers/ProductionRequestControllers");

router.get("/", getAllProductionRequests);
router.post("/", addProductionRequest);
router.put("/:id", updateRequestStatus);
router.delete("/:id", deleteProductionRequest); // ✅ add delete route

module.exports = router;
