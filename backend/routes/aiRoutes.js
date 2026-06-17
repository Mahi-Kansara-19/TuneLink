const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getCollaborationMatches
} = require("../controllers/aiController");

const router = express.Router();

router.get("/collab-matches", protect, getCollaborationMatches);
router.post("/collab-matches", protect, getCollaborationMatches);

module.exports = router;