import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../App.css";

function CollabBoard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
       setProjects(
  (res.data || []).filter(
    (project) => project.status === "Open"
  )
);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

const sendRequest = async (project) => {
  const confirmSend = window.confirm(
    `Send collaboration request?\n\nProject: ${project.title}\nOwner: ${project.owner?.name || "Artist"}\n\nAre you sure you want to send this request?`
  );

  if (!confirmSend) return;

  try {
    setMsg("");

setTimeout(() => {
  setMsg("");
}, 3000);

    await API.post("/collabs/send", {
      projectId: project._id,
      message: "I would like to collaborate on this project."
    });
    setMsg("Request sent successfully ✅");

setTimeout(() => {
  setMsg("");
}, 3000);
  } catch (err) {
    setMsg(err.response?.data?.message || "Failed to send request");
  }
};

  return (
    <div className="app">
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      <Navbar />

      <main style={{ maxWidth: "1100px", width: "100%", margin: "40px auto", padding: "0 20px", flex: 1 }}>
        <div className="glass-card" style={{ marginBottom: "30px" }}>
          <span className="badge badge-accent">Open Projects</span>
          <h2 style={{ fontSize: "2.2rem", marginTop: "12px" }}>Collab Board</h2>
          

          <Link to="/create-project">
            <button className="btn-primary" style={{ marginTop: "20px" }}>
              Create New Project
            </button>
          </Link>
        </div>
{msg && (
  <div className={`toast ${msg.includes("success") ? "success" : "error"}`}>
    <span>
      {msg.includes("success") ? "" : "⚠️"}
    </span>
    {msg}
  </div>
)}

        {loading ? (
          <div className="glass-card">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="glass-card" style={{ textAlign: "center", padding: "50px" }}>
            <h3>No projects yet</h3>
            <p style={{ color: "var(--text-muted)" }}>
              Create the first project on TuneLink.
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {projects.map((project) => (
              <div key={project._id} className="glass-card">
                <div style={{ marginBottom: "15px" }}>
                  <span className="badge badge-primary">{project.genre}</span>
                  <span className="badge badge-accent" style={{ marginLeft: "8px" }}>
                    {project.status}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>
                  {project.title}
                </h3>

                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5", minHeight: "10px" }}>
                 <strong> Description: </strong>{project.publicDescription}
                </p>

  <div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Owner: <strong>{project.owner?.name}</strong>
                  </p>

                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                 <strong>Language: </strong> {project.language}
                  </p>

                 <div style={{ marginTop: "5px", color: "var(--text-muted)" }}>
  <strong>Needed:</strong>{" "}

  {project.requiredRoles
    ?.filter((role) => role !== "Instrumentalist")
    .join(", ")}

  {project.requiredRoles?.includes("Instrumentalist") &&
    project.requiredInstruments?.length > 0 && (
      <>
        {project.requiredRoles.filter(
          (role) => role !== "Instrumentalist"
        ).length > 0 && ", "}

        Instrumentalist ({project.requiredInstruments.join(", ")})
      </>
    )}
</div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>

 {project.status === "Open" ? (
  <button
    className="btn-primary"
    style={{ flex: 1 }}
    onClick={() => sendRequest(project)}
  >
    Apply
  </button>
) : (
  <button
    className="btn-secondary"
    style={{ flex: 1, cursor: "not-allowed", opacity: 0.7 }}
    disabled
  >
    {project.status === "Completed" ? "Completed" : "Requests Closed"}
  </button>
)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CollabBoard;