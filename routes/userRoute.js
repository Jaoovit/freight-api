const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Get
router.get("/user/transporter", userController.getTransportesUsers);
router.get("/user/:id", userController.getUserById);

// Post
router.post(
  "/user/transporter/register",
  upload.single("profileImage"),
  userController.createTransporterUser
);

//Put
router.put("/user/:id", userController.updateLocation);

module.exports = router;
