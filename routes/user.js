const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authToken = require("../middleware/middleware");
const {
  runValidation,
  validateWithImg,
  signUpValidation,
  updateUserValidation,
} = require("../validation");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/images/users/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1 * 1024 * 1024, //1MB
  },
}).single("img");

const multMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    // FILE SIZE ERROR
    if (err instanceof multer.MulterError) {
      return res.json({
        status: false,
        message: "Max file size 1MB allowed!",
      });
    }
    // INVALID FILE TYPE, message will return from fileFilter callback
    else if (err) {
      return res.json({
        status: false,
        message: err.message,
      });
    }
    // FILE NOT SELECTED
    else if (!req.file) {
      return res.json({
        status: false,
        message: "File is required!",
      });
    } else {
      console.log("File uploaded successfully!");
      next();
    }
  });
};

router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserById);
router.post(
  "/",
  multMiddleware,
  signUpValidation,
  validateWithImg,
  UserController.createUser
);
router.post(
  "/signupnoimg",
  signUpValidation,
  runValidation,
  UserController.createUserWithoutImg
);
router.put("/:id", authToken, multMiddleware, UserController.updateUser);
router.put("/updatenoimg/:id", authToken, UserController.updateUserWithoutImg);
router.delete("/:id", authToken, UserController.deleteUser);

module.exports = router;
