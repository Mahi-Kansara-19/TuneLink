import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../App.css";

function ProjectRoom() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/projects/${id}`);
        setProject(res.data);
        setStatus(res.data.status);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const isOwner =
    project?.owner?._id === user.id ||
    project?.owner?._id === user._id;

  const updateStatus = async (newStatus) => {
    try {
      const res = await API.put(`/projects/${id}/status`, {
        status: newStatus
      });

      setStatus(newStatus);
      setProject(res.data.project);
      setMessage("Project status updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const viewProtectedLyrics = async () => {
    try {
      const res = await API.get(`/projects/${id}/protected-lyrics`);
      setLyrics(res.data.lyrics);
      setMessage(res.data.watermark);
    } catch (err) {
      setMessage(err.response?.data?.message || "Access denied");
    }
  };

  const viewLogs = async () => {
    try {
      const res = await API.get(`/projects/${id}/lyrics-logs`);
      setLogs(res.data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Cannot load logs");
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <main className="glass-card" style={{ margin: "40px auto", maxWidth: "900px" }}>
          Loading project...
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="app">
        <Navbar />
        <main className="glass-card" style={{ margin: "40px auto", maxWidth: "900px" }}>
          {message || "Project not found"}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      <Navbar />

      <main style={{ maxWidth: "950px", width: "100%", margin: "40px auto", padding: "0 20px", flex: 1 }}>
        <div className="glass-card" style={{ marginBottom: "25px" }}>
          <span className="badge badge-primary">{project.genre}</span>
          <span className="badge badge-accent" style={{ marginLeft: "8px" }}>
            {status}
          </span>

          <h2 style={{ fontSize: "2.2rem", marginTop: "15px" }}>
            {project.title}
          </h2>

          <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
            Owner: <strong>{project.owner?.name}</strong> • {project.language} • {project.contentType}
          </p>

          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
            Your role here: <strong>{isOwner ? "Project Owner" : "Collaborator"}</strong>
          </p>
        </div>

        {isOwner && (
          <div className="glass-card" style={{ marginBottom: "25px" }}>
            <h3>Project Status</h3>

            <select
              className="form-input"
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
              style={{ maxWidth: "260px", marginTop: "18px" }}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        <div className="glass-card" style={{ marginBottom: "25px" }}>
          <h3>Project Description</h3>
          <p style={{ color: "var(--text-muted)", lineHeight: "1.6", marginTop: "12px" }}>
            {project.publicDescription}
          </p>
        </div>

        <div className="glass-card" style={{ marginBottom: "25px" }}>
          <h3>Required Roles</h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
            {project.requiredRoles?.length > 0 ? (
              project.requiredRoles.map((role, idx) => (
                <span key={idx} className="badge badge-accent">
                  {role}
                </span>
              ))
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No specific role added.</p>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: "25px" }}>
          <h3>Lyrics Preview</h3>
          <p style={{ color: "var(--text-muted)", whiteSpace: "pre-line", marginTop: "12px" }}>
            {project.lyricsPreview || "No public lyrics preview added."}
          </p>
        </div>

        <div className="glass-card" style={{ marginBottom: "25px" }}>
          <h3>Protected Lyrics</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
            Only the owner and accepted collaborators can view protected lyrics.
          </p>

          <button
            className="btn-primary"
            style={{ marginTop: "18px" }}
            onClick={viewProtectedLyrics}
          >
            View Protected Lyrics
          </button>

          {lyrics && (
            <div className="terminal-console" style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
              {lyrics}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ marginBottom: "25px" }}>
          <h3>Collaborators</h3>

          {project.collaborators?.length > 0 ? (
            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {project.collaborators.map((collab) => (
                <div key={collab._id} style={{ color: "var(--text-muted)" }}>
                  {collab.name} • {collab.role}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>
              No collaborators yet.
            </p>
          )}
        </div>

        {isOwner && (
          <div className="glass-card" style={{ marginBottom: "25px" }}>
            <h3>Lyric Access Logs</h3>
            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
              See who viewed your protected lyrics.
            </p>

            <button className="btn-secondary" style={{ marginTop: "18px" }} onClick={viewLogs}>
              View Logs
            </button>

            {logs.length > 0 && (
              <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {logs.map((log) => (
                  <div key={log._id} className="terminal-console">
                    {log.viewerEmail} viewed on {new Date(log.createdAt).toLocaleString()}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {message && (
          <div className="glass-card" style={{ color: "var(--accent)" }}>
            {message}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProjectRoom;