const express = require("express");
const router = express.Router();
const user = require("./user");
const auth = require("./auth");
const place = require("./place");
const appoint = require("./appoint");
const available = require("./available");
const transaction = require("./transaction");
const capster = require("./capster");
const promo = require("./promo");
const worktime = require("./worktime");
const services = require("./services");

router.use("/user", user);
router.use("/auth", auth);
router.use("/place", place);
router.use("/appoint", appoint);
router.use("/available", available);
router.use("/transaction", transaction);
router.use("/capster", capster);
router.use("/promo", promo);
router.use("/worktime", worktime);
router.use("/services", services);

module.exports = router;
