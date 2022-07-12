const express = require("express");
const router = express.Router();
const capsterController = require("../controllers/CapsterController");

router.post("/", capsterController.createCapster);

module.exports = router;
