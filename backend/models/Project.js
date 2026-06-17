const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    contentType: {
      type: String,
      enum: ["Original", "Cover"],
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    mood: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    stage: {
      type: String,
      enum: [
        "Idea Only",
        "Lyrics Completed",
        "Melody Completed",
        "Need Vocals",
        "Need Arrangement",
        "Need Mixing",
      ],
      required: true,
    },

    publicDescription: {
      type: String,
      required: true,
    },

    requiredRoles: {
      type: [String],
      default: [],
    },

    requiredInstruments: {
  type: [String],
  default: [],
},
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
    },

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);