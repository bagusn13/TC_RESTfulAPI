require("dotenv").config();
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

async function createOtp(params, callback) {
  const otp = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  // 5 minute
  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${params.phone}.${otp}.${expires}`;
  const hash = crypto
    .createHmac("sha256", process.env.KEY_SECRET_OTP)
    .update(data)
    .digest("hex");
  const fullHash = `${hash}.${expires}`;

  console.log(`Your OTP is ${otp}`);

  // Send to wa using whatsapp-web.js

  // Send to email using nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_TC,
      pass: process.env.PASSWORD_TC,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_TC,
    to: params.email,
    subject: "Tempat Cukur",
    text: `Your OTP is ${otp}. Don't share this code with others`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    console.log("Email sent: " + info.response);
  });

  return callback(null, fullHash);
}

async function verifyOtp(params, callback) {
  let [hashValue, expires] = params.hash.split(".");

  let now = Date.now();
  if (now > parseInt(expires)) return callback("OTP Expired");

  let data = `${params.phone}.${params.otp}.${expires}`;
  let newCalculateHash = crypto
    .createHmac("sha256", process.env.KEY_SECRET_OTP)
    .update(data)
    .digest("hex");

  if (newCalculateHash === hashValue) {
    return callback(null, "Success");
  } else {
    return callback("Invalid OTP");
  }
}

module.exports = { createOtp, verifyOtp };
