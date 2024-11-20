const express = require("express");
const deliveryController = require("../controllers/deliveryController");
const verifyToken = require("../config/token");
const router = express.Router();

// Get
router.get("/delivery/unpaid", deliveryController.getUnpaidDelivery);

// Put
router.put(
  "/delivery/:id",
  verifyToken,
  deliveryController.updateDeliveryToPaid
);

module.exports = router;
