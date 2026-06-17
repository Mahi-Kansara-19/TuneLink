const User = require("../models/User");
const Profile = require("../models/ArtistProfile");
const Project = require("../models/Project");
const CollaborationRequest = require("../models/CollaborationRequest");

exports.getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const profiles = users;
    const projects = await Project.countDocuments();
    const requests = await CollaborationRequest.countDocuments();

    res.json({ users, profiles, projects, requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};