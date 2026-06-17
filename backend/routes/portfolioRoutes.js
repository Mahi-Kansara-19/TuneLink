const express = require("express");
const router = express.Router();

const {
  addPortfolioItem,
  getArtistPortfolio,
  deletePortfolioItem,
} = require("../controllers/portfolioController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addPortfolioItem);
router.get("/:artistId", protect, getArtistPortfolio);
router.delete("/:id", protect, deletePortfolioItem);

module.exports = router;