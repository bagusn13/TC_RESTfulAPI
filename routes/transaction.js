const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/TransactionController");
const authToken = require("../middleware/middleware");

router.post("/", authToken,transactionController.createTransaction);

module.exports = router;
