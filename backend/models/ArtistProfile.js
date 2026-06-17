const mongoose = require("mongoose");

const artistProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    profileVisitors: {
  type: Number,
  default: 0,
},

visitedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
profileViews: {
  type: Number,
  default: 0,
},
    stageName: {
      type: String,
      required: true
    },

    bio: {
      type: String,
      default: ""
    },

    genres: {
      type: [String],
      default: []
    },

    languages: {
      type: [String],
      default: []
    },

    skills: {
      type: [String],
      default: []
    },

    location: {
      type: String,
      default: ""
    },

    experienceLevel: {
      type: String,
      enum: ["Bedroom Artist", "Rising Voice", "Hidden Gem", "Headliner"],
      default: "Bedroom Artist"
    },

    demoLink: {
      type: String,
      default: ""
    },

    equipment: {
      type: String,
      default: ""
    },

    collaborationStatus: {
      type: String,
      enum: ["Open to Collab", "Busy", "Just Exploring"],
      default: "Open to Collab"
    },

    badges: {
      type: [String],
      default: []
    },

    rating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ArtistProfile", artistProfileSchema);