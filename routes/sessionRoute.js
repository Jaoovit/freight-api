const express = require("express");
const sessionController = require("../controllers/sessionController");
const router = express.Router();

// Post
router.post("/login", sessionController.login);
router.post("/logout", sessionController.logout);

module.exports = router;
