const express = require("express");
const router = express.Router();
const availableController = require("../controllers/AvailableController");
const authToken = require("../middleware/middleware");

router.get("/:placeId/:date", availableController.getAvailable);

module.exports = router;
