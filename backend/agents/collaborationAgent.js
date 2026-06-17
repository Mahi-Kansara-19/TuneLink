const ArtistProfile = require("../models/ArtistProfile");
const Project = require("../models/Project");

const findMatchingArtists = async (projectId, currentUserId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const requiredRoles = project.requiredRoles || [];
  const requiredInstruments = project.requiredInstruments || [];

  const profiles = await ArtistProfile.find()
    .populate("user", "name email roles instruments genre plan isAdmin")
    .lean();

  const matches = profiles
    .filter((profile) => {
      if (!profile.user) return false;

      const artistUserId = profile.user._id.toString();
      const currentId = currentUserId.toString();

      if (artistUserId === currentId) return false;
      if (profile.user.isAdmin) return false;

      const isAlreadyCollaborator = (project.collaborators || []).some(
        (id) => id.toString() === artistUserId
      );

      if (isAlreadyCollaborator) return false;

      return true;
    })
    .map((profile) => {
      let score = 0;
      const reasons = [];

      const artistRoles = profile.user.roles || [];
      const artistInstruments = profile.user.instruments || [];
      const artistGenres = profile.genres || [];
      const artistLanguages = profile.languages || [];

      const matchedRoles = requiredRoles.filter((role) =>
        artistRoles.includes(role)
      );

      if (matchedRoles.length > 0) {
        score += 40;
        reasons.push(`Role match: ${matchedRoles.join(", ")}`);
      }

      const matchedInstruments = requiredInstruments.filter((instrument) =>
        artistInstruments.includes(instrument)
      );

      if (matchedInstruments.length > 0) {
        score += 45;
        reasons.push(`Plays required instrument: ${matchedInstruments.join(", ")}`);
      }

      if (artistGenres.includes(project.genre) || profile.user.genre === project.genre) {
        score += 25;
        reasons.push(`Genre match: ${project.genre}`);
      }

      if (artistLanguages.includes(project.language)) {
        score += 15;
        reasons.push(`Language match: ${project.language}`);
      }

      if (profile.rating >= 4) {
        score += 10;
        reasons.push("Good artist rating");
      }

      return {
        artist: profile,
        matchScore: Math.min(score, 100),
        reasons,
      };
    })
    .filter((match) => match.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  return matches;
};

module.exports = { findMatchingArtists };