const express = require("express");
const router = express.Router();
const WorkingTimeController = require("../controllers/WorkingTimeController");

router.get("/:mitra_id", WorkingTimeController.getAllDayByIdPlace);
router.post("/", WorkingTimeController.createWorkingTime);

module.exports = router;
