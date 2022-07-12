const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/ServiceController");

router.get("/", ServiceController.getAllServices);
router.post("/", ServiceController.createService);

module.exports = router;
