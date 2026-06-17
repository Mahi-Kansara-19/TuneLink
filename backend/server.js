const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const collabRoutes = require("./routes/collabRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/collabs", collabRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/portfolio", portfolioRoutes);
const User = require("./models/User");
const Project = require("./models/Project");

app.get("/api/stats", async (req, res) => {
  try {
    const totalArtists = await User.countDocuments();
    const activeCollaborations = await Project.countDocuments();
    res.json({
      totalArtists,
      activeCollaborations,
      algorithmFree: 100
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("TuneLink Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});