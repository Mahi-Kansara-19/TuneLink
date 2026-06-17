import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function CreateProject() {
  const navigate = useNavigate();

const roleOptions = [
  "Singer",
  "Lyricist",
  "Producer",
  "Instrumentalist",
  "Composer",
  "Rapper",
  "Mix Engineer",
];

  const [projectData, setProjectData] = useState({
  title: "",
  contentType: "Original",
  genre: "Indie Pop",
  mood: "Emotional",
  language: "Hindi",
  requiredInstruments: [],
  stage: "Lyrics Completed",
  publicDescription: "",
  requiredRoles: [],
});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

const handleRoleChange = (role) => {
  setProjectData((prev) => {
    const updatedRoles = prev.requiredRoles.includes(role)
      ? prev.requiredRoles.filter((r) => r !== role)
      : [...prev.requiredRoles, role];

    return {
      ...prev,
      requiredRoles: updatedRoles,
      requiredInstruments: updatedRoles.includes("Instrumentalist")
        ? prev.requiredInstruments
        : [],
    };
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    if (projectData.requiredRoles.length === 0) {
      setError("Please select at least one role needed.");
      setIsLoading(false);
      return;
    }

    try {
      await API.post("/projects", projectData);

      setMessage("Project created successfully 🚀");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };
  const instrumentOptions = [
  "Acoustic Guitar",
  "Electric Guitar",
  "Bass Guitar",
  "Piano",
  "Keyboard",
  "Violin",
  "Drums",
  "Ukulele",
  "Flute",
  "Saxophone",
  "Tabla",
  "Harmonium",
  "Cello",
  "Trumpet",
  "Cajon",
];
const handleInstrumentNeededChange = (instrument) => {
  setProjectData((prev) => ({
    ...prev,
    requiredInstruments: prev.requiredInstruments.includes(instrument)
      ? prev.requiredInstruments.filter((i) => i !== instrument)
      : [...prev.requiredInstruments, instrument],
  }));
};

  return (
    <>
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      <main
        style={{
          maxWidth: "900px",
          width: "100%",
          margin: "40px auto",
          padding: "110px 20px 40px",
          flex: 1,
          textAlign: "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="glass-card">
          <div style={{ marginBottom: "30px" }}>
            <span className="badge badge-accent" style={{ marginBottom: "12px" }}>
              Safe Collab Board
            </span>

            <h2 style={{ fontSize: "2rem" }}>Create New Project</h2>

          
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Project / Song Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., Untitled Indie-Pop Track"
                value={projectData.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Content Type</label>
                <select
                  name="contentType"
                  value={projectData.contentType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Original">Original</option>
                  <option value="Cover">Cover</option>
                </select>
              </div>

              <div className="form-group">
                <label>Language</label>
                <select
                  name="language"
                  value={projectData.language}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Hindi / English">Hindi / English</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Genre</label>
                <select
                  name="genre"
                  value={projectData.genre}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Indie Pop">Indie Pop</option>
                  <option value="Acoustic">Acoustic</option>
                  <option value="Lo-Fi Hip Hop">Lo-Fi Hip Hop</option>
                  <option value="Rock / Metal">Rock / Metal</option>
                  <option value="R&B / Soul">R&B / Soul</option>
                  <option value="Bollywood">Bollywood</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mood</label>
                <select
                  name="mood"
                  value={projectData.mood}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Emotional">Emotional</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Sad">Sad</option>
                  <option value="Energetic">Energetic</option>
                  <option value="Dreamy">Dreamy</option>
                  <option value="Chill">Chill</option>
                  <option value="Dark">Dark</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Project Stage</label>
              <select
                name="stage"
                value={projectData.stage}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Idea Only">Idea Only</option>
                <option value="Lyrics Completed">Lyrics Completed</option>
                <option value="Melody Completed">Melody Completed</option>
                <option value="Need Vocals">Need Vocals</option>
                <option value="Need Arrangement">Need Arrangement</option>
                <option value="Need Mixing">Need Mixing</option>
              </select>
            </div>

            <div className="form-group">
              <label>Roles Needed</label>

              <div className="role-checkbox-grid">
                {roleOptions.map((role) => (
                  <label key={role} className="role-checkbox">
                    <input
                      type="checkbox"
                      checked={projectData.requiredRoles.includes(role)}
                      onChange={() => handleRoleChange(role)}
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {projectData.requiredRoles.includes("Instrumentalist") && (
  <div className="form-group">
    <label>Which instruments are needed?</label>

    <div className="role-checkbox-grid">
      {instrumentOptions.map((instrument) => (
        <label key={instrument} className="role-checkbox">
          <input
            type="checkbox"
            checked={projectData.requiredInstruments.includes(instrument)}
            onChange={() => handleInstrumentNeededChange(instrument)}
          />
          <span>{instrument}</span>
        </label>
      ))}
    </div>
  </div>
)}

            <div className="form-group">
              <label>Public Description</label>
              <textarea
                name="publicDescription"
                required
                rows="5"
                placeholder="Example: Looking for a producer to help arrange and mix an emotional indie-pop song. No lyrics shared here."
                value={projectData.publicDescription}
                onChange={handleChange}
                className="form-input"
                style={{ resize: "vertical" }}
              />
            </div>

            

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "20px",
                padding: "14px",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish Project"}
            </button>
          </form>

          {message && <div className="form-message success">{message}</div>}
          {error && <div className="form-message error">{error}</div>}
        </div>
      </main>
    </>
  );
}

export default CreateProject;