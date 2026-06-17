const CollaborationRequest = require("../models/CollaborationRequest");
const Project = require("../models/Project");

const sendCollabRequest = async (req, res) => {
  try {
    const { projectId, message } = req.body;

    const project = await Project.findById(projectId);
    if (project.status !== "Open") {
  return res.status(400).json({
    message: "Requests are closed for this project.",
  });
}
    if (project.status === "Completed") {
  return res.status(400).json({
    message: "This project is already completed. Requests are closed.",
  });
}

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot request your own project" });
    }

    const existingRequest = await CollaborationRequest.findOne({
      project: projectId,
      sender: req.user._id
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = await CollaborationRequest.create({
      project: projectId,
      sender: req.user._id,
      receiver: project.owner,
      message
    });

    res.status(201).json({
      message: "Collaboration request sent",
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReceivedRequests = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({
      receiver: req.user._id
    })
      .populate("project", "title genre language")
      .populate("sender", "name email role plan");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySentRequests = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({
      sender: req.user._id
    })
      .populate("project", "title genre language")
      .populate("receiver", "name email role plan");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const inviteArtistToMyProject = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver artist is required" });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    const project = await Project.findOne({
      owner: req.user._id,
      status: "Open"
    }).sort({ createdAt: -1 });

    if (!project) {
      return res.status(400).json({
        message: "Please create a project first before inviting an artist"
      });
    }

    const existingRequest = await CollaborationRequest.findOne({
      project: project._id,
      sender: req.user._id,
      receiver: receiverId
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Invite already sent to this artist" });
    }

    const request = await CollaborationRequest.create({
      project: project._id,
      sender: req.user._id,
      receiver: receiverId,
      message: message || `I would like to invite you to collaborate on ${project.title}`
    });

    res.status(201).json({
      message: "Collaboration invite sent successfully",
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await CollaborationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    request.status = status;
    await request.save();

    if (status === "Accepted") {
      await Project.findByIdAndUpdate(request.project, {
        $addToSet: { collaborators: request.sender }
      });
    }

    res.json({
      message: `Request ${status}`,
      request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const withdrawRequest = async (req, res) => {
  try {
    const request = await CollaborationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ message: "Only pending requests can be withdrawn" });
    }

    await request.deleteOne();

    res.json({ message: "Request withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  sendCollabRequest,
  inviteArtistToMyProject,
  getMyReceivedRequests,
  getMySentRequests,
  updateRequestStatus,
  withdrawRequest,
};