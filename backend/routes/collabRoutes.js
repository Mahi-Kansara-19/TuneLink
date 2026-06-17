const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  sendCollabRequest,
  inviteArtistToMyProject,
  getMyReceivedRequests,
  getMySentRequests,
  updateRequestStatus,
  withdrawRequest,
} = require("../controllers/collabController");

const router = express.Router();

router.post("/send", protect, sendCollabRequest);
router.get("/received", protect, getMyReceivedRequests);
router.get("/sent", protect, getMySentRequests);
router.put("/:id/status", protect, updateRequestStatus);
router.post("/invite", protect, inviteArtistToMyProject);
router.delete("/:id/withdraw", protect, withdrawRequest);
module.exports = router;