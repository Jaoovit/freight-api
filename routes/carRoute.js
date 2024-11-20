const express = require("express");
const carController = require("../controllers/carController");
const verifyToken = require("../config/token");
const router = express.Router();

// Put
router.put("/car/:id", verifyToken, carController.updateCarSize);

// Delete
router.delete("/car/:id", verifyToken, carController.deleteCar);

module.exports = router;
