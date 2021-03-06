const express = require("express");
const router = express.Router();
const appointController = require("../controllers/AppointmentController");
const authToken = require("../middleware/middleware");

router.post("/", authToken, appointController.createAppoint);
router.get("/", appointController.getAllAppoint);
router.get("/:userId", appointController.getAppointByUserId);
router.delete("/:id", authToken, appointController.deleteAppoint);

module.exports = router;
