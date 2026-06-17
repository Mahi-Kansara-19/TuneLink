const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/stats", authMiddleware, adminOnly, getAdminStats);
router.get("/users", authMiddleware, adminOnly, getAllUsers);
router.delete("/users/:id", authMiddleware, adminOnly, deleteUser);

module.exports = router;