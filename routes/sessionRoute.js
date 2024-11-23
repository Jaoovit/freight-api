const express = require("express");
const sessionController = require("../controllers/sessionController");
const router = express.Router();

// Post
router.post("/session/login", sessionController.login);
router.post("/session/logout", sessionController.logout);

module.exports = router;
