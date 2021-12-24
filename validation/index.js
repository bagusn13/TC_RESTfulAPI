const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

const validateWithImg = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    path.sep = "/";
    const pathRaw = req.file.path;
    fs.unlink("./" + pathRaw.replace(/\\/g, path.sep), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Upload failed. An error occured in the controller");
    });
    return res.status(400).json({
      status: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

const signUpValidation = [
  check("firstName", "FirstName field cannot be empty").notEmpty(),
  check("lastName", "LastName field cannot be empty").notEmpty(),
  check("email", "Email field cannot be empty")
    .notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage("Invalid email"),
  check("password", "Password field cannot be empty")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character"),
  check("phone", "The phone field cannot be empty").notEmpty(),
  check("role", "Role field cannot be empty").notEmpty(),
];

const signInValidation = [
  check("email", "Email field cannot be empty")
    .notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage("Invalid email"),
  check("password", "Password field cannot be empty")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character"),
];

const updateUserValidation = [
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character"),
];

module.exports = {
  runValidation,
  validateWithImg,
  signUpValidation,
  signInValidation,
  updateUserValidation,
};
