const express = require("express");
const deliveryController = require("../controllers/deliveryController");
const verifyToken = require("../config/token");
const router = express.Router();

// Get
router.get("/delivery/unpaid", deliveryController.getUnpaidDelivery);
router.get("/delivery/undelivered", deliveryController.getUndeliveredDelivery);

// Put
router.put(
  "/delivery/:id",
  verifyToken,
  deliveryController.updateDeliveryToPaid
);

router.put(
  "/delivery/:id",
  verifyToken,
  deliveryController.updateDeliveryToDelivered
);

module.exports = router;
