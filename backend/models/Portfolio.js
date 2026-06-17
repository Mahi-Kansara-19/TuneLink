const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["YouTube", "Spotify", "SoundCloud", "Instagram", "Demo", "Instrument Cover"],
      required: true,
    },

    link: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);