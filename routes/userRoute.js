const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Post
router.post(
  "/user/transporter/register",
  upload.single("profileImage"),
  userController.createTransporterUser
);

module.exports = router;
