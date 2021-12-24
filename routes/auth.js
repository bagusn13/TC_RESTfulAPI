const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const { runValidation, signInValidation } = require("../validation");

router.post(
  "/signin",
  signInValidation,
  runValidation,
  authController.loginUser
);
router.post("/refreshtoken", authController.refreshToken);
router.post("/signout", authController.logoutUser);
router.post("/otpregister", authController.otpRegister);
router.post("/verifyotp", authController.verifyOtp);

module.exports = router;
