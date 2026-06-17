const ArtistProfile = require("../models/ArtistProfile");
const User = require("../models/User");

const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      stageName,
      bio,
      genres,
      languages,
      skills,
      location,
      experienceLevel,
      demoLink,
      equipment,
      badges,
      collaborationStatus,
    } = req.body;

    const profile = await ArtistProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        stageName,
        bio,
        genres,
        languages,
        skills,
        location,
        experienceLevel,
        demoLink,
        equipment,
        badges,
        collaborationStatus,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      message: "Artist profile saved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const incrementProfileView = async (req, res) => {
  try {
    let profile = await ArtistProfile.findById(req.params.id);

    // If profile id not found, treat id as user id
    if (!profile) {
      profile = await ArtistProfile.findOne({ user: req.params.id });
    }

    // If still no profile, create one for that user
    if (!profile) {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "Profile not found" });
      }

      profile = await ArtistProfile.create({
        user: user._id,
        stageName: user.name,
        bio: "",
        genres: [user.genre || "Music"],
        location: "Online",
        profileVisitors: 0,
        visitedBy: [],
      });
    }

    // Do not count owner viewing their own profile
    if (profile.user.toString() === req.user._id.toString()) {
      return res.json({
        profileVisitors: profile.profileVisitors || 0,
      });
    }

    const alreadyVisited = profile.visitedBy?.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!alreadyVisited) {
      profile.profileVisitors = (profile.profileVisitors || 0) + 1;
      profile.visitedBy = [...(profile.visitedBy || []), req.user._id];
      await profile.save();
    }

    res.json({
      profileVisitors: profile.profileVisitors || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMyProfile = async (req, res) => {
  try {
    const profile = await ArtistProfile.findOne({ user: req.user._id }).populate(
      "user",
      "name email roles instruments plan"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const users = await User.find().select("name email roles instruments plan");

    const profiles = await ArtistProfile.find().populate(
      "user",
      "name email roles instruments plan"
    );

    const formattedUsers = users.map((user) => {
      const profile = profiles.find(
        (p) => p.user && p.user._id.toString() === user._id.toString()
      );

      if (profile) {
        return profile;
      }

      return {
        _id: user._id,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          instruments: user.instruments,
          plan: user.plan,
        },
        stageName: user.name,
        bio: "TuneLink music creator looking for collaborations.",
        genres: ["Music"],
        languages: [],
        skills: user.roles || [],
        location: "Online",
        experienceLevel: "Beginner",
        demoLink: "",
        equipment: "Not added yet",
        badges: [],
        collaborationStatus: "Open",
        profileViews: 0,
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicProfileById = async (req, res) => {
  try {
    let profile = await ArtistProfile.findById(req.params.id).populate(
      "user",
      "name email roles instruments genre plan"
    );

    if (!profile) {
      profile = await ArtistProfile.findOne({ user: req.params.id }).populate(
        "user",
        "name email roles instruments genre plan"
      );
    }

    if (!profile) {
      const user = await User.findById(req.params.id).select(
        "name email roles instruments genre plan"
      );

      if (!user) {
        return res.status(404).json({ message: "Profile not found" });
      }

      profile = await ArtistProfile.create({
        user: user._id,
        stageName: user.name,
        bio: "",
        genres: [user.genre || "Music"],
        location: "Online",
        profileVisitors: 0,
        visitedBy: [],
      });

      await profile.populate("user", "name email roles instruments genre plan");
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
  getPublicProfileById,
  incrementProfileView,
};