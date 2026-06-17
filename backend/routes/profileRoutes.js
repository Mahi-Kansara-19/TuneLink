const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
  getPublicProfileById,
  incrementProfileView,
} = require("../controllers/profileController");

const router = express.Router();

router.post("/", protect, createOrUpdateProfile);
router.get("/me", protect, getMyProfile);
router.get("/:id", protect, getPublicProfileById);
router.get("/", getAllProfiles);
router.put("/:id/view", protect, incrementProfileView);

module.exports = router;