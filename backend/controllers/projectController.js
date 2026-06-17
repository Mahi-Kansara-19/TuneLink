const Project = require("../models/Project");
const LyricAccessLog = require("../models/LyricAccessLog");

const createProject = async (req, res) => {
  try {
   const {
  title,
  contentType,
  genre,
  mood,
  language,
  stage,
  publicDescription,
  requiredRoles
} = req.body;
    if (!title || !contentType || !genre || !language || !publicDescription) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const project = await Project.create({
  owner: req.user._id,
  title,
  contentType,
  genre,
  mood,
  language,
  stage,
  publicDescription,
  requiredRoles,
  requiredInstruments: req.body.requiredInstruments || [],
});

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .select("-protectedLyrics")
      .populate("owner", "name email role plan")
      .populate("collaborators", "name email role plan")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate("owner", "name email role plan")
      .populate("collaborators", "name email role plan")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyWork = async (req, res) => {
  try {
    const ownedProjects = await Project.find({ owner: req.user._id })
      .populate("owner", "name email role plan")
      .populate("collaborators", "name email role plan")
      .sort({ createdAt: -1 });

    const collaborationProjects = await Project.find({
      collaborators: req.user._id,
      owner: { $ne: req.user._id }
    })
      .populate("owner", "name email role plan")
      .populate("collaborators", "name email role plan")
      .sort({ createdAt: -1 });

    res.json({
      ownedProjects,
      collaborationProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "owner collaborators",
      "name email role plan"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner._id.toString() === req.user._id.toString();

    const isCollaborator = project.collaborators.some(
      (collab) => collab._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      project.protectedLyrics = undefined;
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Open", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

   if (project.owner.toString() !== req.user._id.toString()) {
  return res.status(403).json({
    message: "Only project owner can update status",
  });
}

    project.status = status;
    await project.save();

    res.json({
      message: "Project status updated successfully",
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewProtectedLyrics = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "owner collaborators",
      "name email role"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner._id.toString() === req.user._id.toString();

    const isCollaborator = project.collaborators.some(
      (collab) => collab._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({
        message: "Access denied. Only owner or accepted collaborators can view lyrics."
      });
    }

    await LyricAccessLog.create({
      project: project._id,
      viewedBy: req.user._id,
      viewerEmail: req.user.email
    });

    res.json({
      projectId: project._id,
      title: project.title,
      lyrics: project.protectedLyrics,
      watermark: `Viewed by ${req.user.email} on ${new Date().toLocaleString()} | Project ID: ${project._id}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLyricAccessLogs = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only owner can view access logs" });
    }

    const logs = await LyricAccessLog.find({ project: req.params.id }).populate(
      "viewedBy",
      "name email role"
    );

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only project owner can edit this project",
      });
    }

    const allowedFields = [
      "title",
      "genre",
      "language",
      "mood",
      "stage",
      "publicDescription",
      "requiredRoles",
      "requiredInstruments",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getMyProjects,
  getMyWork,
  getProjectById,
  updateProjectStatus,
  viewProtectedLyrics,
  getLyricAccessLogs,
  updateProject
};