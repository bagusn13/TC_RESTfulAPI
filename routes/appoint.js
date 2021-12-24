const express = require("express");
const router = express.Router();
const appointController = require("../controllers/AppointmentController");
const authToken = require("../middleware/middleware");

router.post("/", appointController.createAppoint);
router.get("/", authToken, appointController.getAllAppoint);
router.get("/:userId", appointController.getAppointByUserId);
router.delete("/:appointId/:userId", appointController.deleteAppoint);

module.exports = router;
