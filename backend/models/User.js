const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    isAdmin: {
  type: Boolean,
  default: false,
},
    name: {
      type: String,
      required: true,
      trim: true,
    },


    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    genre: {
  type: String,
  default: "Music",
},

    password: {
      type: String,
      required: true,
    },

    roles: {
  type: [String],
  required: true,
  enum: [
   "Singer",
  "Lyricist",
  "Producer",
  "Instrumentalist",
  "Composer",
  "Rapper",
  "Mix Engineer",
  ],
  default: [],
},

resetPasswordToken: String,
resetPasswordExpire: Date,

instruments: {
  type: [String],
  default: [],
}, 
    plan: {
      type: String,
      enum: ["Free", "Pro Artist", "Band Plan"],
      default: "Free",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);