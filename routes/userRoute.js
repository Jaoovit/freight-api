const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const carController = require("../controllers/carController");
const router = express.Router();
const verifyToken = require("../config/token");

const upload = multer({ storage: multer.memoryStorage() });

// Get
router.get("/user/transporter", userController.getTransportesUsers);
router.get("/user/:id", userController.getUserById);
router.get(
  "/user/transporter/search",
  userController.searchUserTransporterByLocation
);

// Post
router.post(
  "/user/transporter/register",
  upload.single("profileImage"),
  userController.createTransporterUser
);
router.post(
  "/user/admin/register",
  upload.single("profileImage"),
  userController.createAdminUser
);
router.post("/user/:id/car", verifyToken, carController.registerCar);

//Put
router.put("/user/:id/location", verifyToken, userController.updateLocation);
router.put("/user/:id/workdays", verifyToken, userController.updateWorkDays);
router.put("/user/:id/phone", verifyToken, userController.updatePhone);
router.put(
  "/user/:id/profileImage",
  verifyToken,
  upload.single("profileImage"),
  userController.updateProfileImage
);

module.exports = router;
