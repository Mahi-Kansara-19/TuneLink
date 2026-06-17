const Project = require("../models/Project");
const { findMatchingArtists } = require("../agents/collaborationAgent");
const { generateMatchExplanation } = require("../agents/growthAgent");

const getCollaborationMatches = async (req, res) => {
  try {
    let projectId = req.body?.projectId || req.query?.projectId;

    if (!projectId) {
      const openProject = await Project.findOne({
        owner: req.user._id,
        status: "Open",
      }).sort({ createdAt: -1 });

      if (!openProject) {
        return res.json({
          message: "Create an open project first to get AI matches.",
          project: null,
          matches: [],
        });
      }

      projectId = openProject._id;
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only get matches for your own projects.",
      });
    }

    if (project.status !== "Open") {
      return res.json({
        message: "AI Match works only for open projects.",
        project,
        matches: [],
      });
    }

    const matches = await findMatchingArtists(projectId, req.user._id);

    const matchesWithAI = await Promise.all(
      matches.slice(0, 6).map(async (match) => {
        const aiExplanation = await generateMatchExplanation(
          project,
          match.artist
        );

       return {
  ...match,
  profileId: match.artist?._id,
  artistId: match.artist?.user?._id,
  projectId: project._id,
  projectTitle: project.title,
  projectGenre: project.genre,
  requiredRoles: project.requiredRoles,
  requiredInstruments: project.requiredInstruments || [],
  aiExplanation,
};
      })
    );

    res.json({
      message: "AI-powered matching artists found",
      project,
      matches: matchesWithAI,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCollaborationMatches };