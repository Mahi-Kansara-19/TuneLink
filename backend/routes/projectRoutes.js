const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getAllProjects,
  getMyProjects,
  getMyWork,
  getProjectById,
  viewProtectedLyrics,
  getLyricAccessLogs,
  updateProjectStatus,
  updateProject
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", getAllProjects);
router.get("/my", protect, getMyProjects);
router.get("/work/my", protect, getMyWork);

router.get("/:id/protected-lyrics", protect, viewProtectedLyrics);
router.get("/:id/lyrics-logs", protect, getLyricAccessLogs);

router.put("/:id/status", protect, updateProjectStatus);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);

module.exports = router;