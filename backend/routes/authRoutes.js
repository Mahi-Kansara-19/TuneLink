const express = require("express");

const { registerUser, loginUser, updateUserProfile,forgotPassword, resetPassword } = require("../controllers/authController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.put("/me", protect, updateUserProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;