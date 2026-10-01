const express = require("express");
const { register, login } = require("../controllers/authController");
const { profile, logout } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.post("/logout", protect, logout);

module.exports = router;
