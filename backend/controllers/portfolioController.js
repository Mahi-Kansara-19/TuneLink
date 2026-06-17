const Portfolio = require("../models/Portfolio");

const addPortfolioItem = async (req, res) => {
  try {
    const { title, type, link, description } = req.body;

    if (!title || !type || !link) {
      return res.status(400).json({ message: "Title, type and link are required" });
    }

    const item = await Portfolio.create({
      artist: req.user._id,
      title,
      type,
      link,
      description,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArtistPortfolio = async (req, res) => {
  try {
    const items = await Portfolio.find({ artist: req.params.artistId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    if (item.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await item.deleteOne();

    res.json({ message: "Portfolio item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPortfolioItem,
  getArtistPortfolio,
  deletePortfolioItem,
};