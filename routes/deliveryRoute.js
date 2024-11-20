const express = require("express");
const deliveryController = require("../controllers/deliveryController");
const router = express.Router();

// Put
router.put("/delivery/:id", deliveryController.updateDeliveryToPaid);

module.exports = router;
