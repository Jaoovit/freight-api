const express = require("express");
const carController = require("../controllers/carController");
const deliveryController = require("../controllers/deliveryController");
const verifyToken = require("../config/token");
const router = express.Router();

// Get
router.get("/car/:id", carController.getCarById);
router.get("/car/user/:id", carController.getCarByUserId);

// Post
router.post(
  "/car/:id/delivery",
  verifyToken,
  deliveryController.registerDelivery
);

// Put
router.put("/car/:id", verifyToken, carController.updateCarSize);

// Delete
router.delete("/car/:id", verifyToken, carController.deleteCar);

module.exports = router;
