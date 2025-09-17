const express = require("express");
const router = express.Router();
const DailyTargetController = require("../controllers/DailyTargetController");

router.get("/", DailyTargetController.getAllDailyTargets);
router.post("/", DailyTargetController.addDailyTarget);
router.get("/:id", DailyTargetController.getbyid);
router.put("/:id", DailyTargetController.updatetargets);
router.delete("/:id", DailyTargetController.deletetarget);

module.exports = router;
