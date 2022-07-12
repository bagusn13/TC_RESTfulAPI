const express = require("express");
const log = require("../logger");
const router = express.Router();
const PromoController = require("../controllers/PromoController");
const multer = require("multer");
const path = require("path");
const authToken = require("../middleware/middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/images/promos/");
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
      next();
    }
  });
};

router.post("/", multMiddleware, PromoController.createPromo);
router.get("/", PromoController.getAllPromo);
router.get("/:id", PromoController.getPromoById);
router.get("/code/:code", PromoController.getPromoByCode);
router.delete("/:id", PromoController.deletePromo);
router.put("/:id", multMiddleware, PromoController.updatePromo);

module.exports = router;
