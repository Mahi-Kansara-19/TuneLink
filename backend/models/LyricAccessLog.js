const mongoose = require("mongoose");

const lyricAccessLogSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    viewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    viewerEmail: {
      type: String,
      required: true
    },

    action: {
      type: String,
      enum: ["Viewed Lyrics"],
      default: "Viewed Lyrics"
    },

    viewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("LyricAccessLog", lyricAccessLogSchema);