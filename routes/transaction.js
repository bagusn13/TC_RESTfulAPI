const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/TransactionController");

router.post("/", transactionController.createTransaction);

module.exports = router;
