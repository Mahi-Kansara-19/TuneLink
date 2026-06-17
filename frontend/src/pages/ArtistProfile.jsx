import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function ArtistProfile() {
  const { id } = useParams();
  const countedView = useRef(false);

  const [profile, setProfile] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [msg, setMsg] = useState("");

  useEffect(() => {
  const fetchArtistProfile = async () => {
    try {
      const profileRes = await API.get(`/profiles/${id}`);
      setProfile(profileRes.data);

      if (!countedView.current) {
        countedView.current = true;

        const viewRes = await API.put(`/profiles/${id}/view`);

        setProfile((prev) => ({
          ...prev,
          profileVisitors: viewRes.data.profileVisitors,
        }));
      }

      const artistUserId = profileRes.data.user?._id;

      if (artistUserId) {
        const portfolioRes = await API.get(`/portfolio/${artistUserId}`);
        setPortfolioItems(portfolioRes.data || []);

        const projectsRes = await API.get("/projects");
        setProjects(
          projectsRes.data.filter(
            (project) => project.owner?._id === artistUserId
          )
        );
      }
    } catch (err) {
      console.log("Artist profile error:", err.response?.data || err.message);
alert(err.response?.data?.message || "Failed to load artist profile");
    }
  };

  fetchArtistProfile();
}, [id]);
  if (!profile) {
    return (
      <div className="app">


        <main style={{ padding: "140px 20px", textAlign: "center" }}>
          Loading artist profile...
        </main>
      </div>
    );
  }
 

  const openProjects = projects.filter((p) => p.status === "Open");
  const inProgressProjects = projects.filter((p) => p.status === "In Progress");
  const completedProjects = projects.filter((p) => p.status === "Completed");
const sendRequest = async (projectId) => {
  try {
    await API.post("/collabs/send", {
      projectId,
      message: "I would like to collaborate on this project.",
    });

    setMsg("Request sent successfully ✅");

    setTimeout(() => {
      setMsg("");
    }, 3000);
  } catch (err) {
    setMsg(err.response?.data?.message || "Failed to send request");

    setTimeout(() => {
      setMsg("");
    }, 3000);
  }
};
  return (
    <div className="app">
      {msg && (
      <div className={`toast ${msg.includes("success") ? "success" : "error"}`}>
        <span>{msg.includes("success") ? "" : "⚠️"}</span>
        {msg}
      </div>
    )}
      <main style={{ maxWidth: "1050px", margin: "0 auto", padding: "130px 20px 50px" }}>
        <div className="glass-card" style={{ marginBottom: "25px" }}>
          <div style={{ display: "flex", gap: "25px", alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                width: "95px",
                height: "95px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "grid",
                placeItems: "center",
                fontSize: "2.6rem",
                fontWeight: "900",
                color: "white"
              }}
            >
              {(profile.stageName || profile.user?.name)?.charAt(0)}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "2.6rem", marginBottom: "8px" }}>
                {profile.stageName || profile.user?.name}
              </h1>

              <p style={{ color: "var(--text-muted)", marginBottom: "14px" }}>
                👤 {profile.profileVisitors || 0} profile visitors
              </p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {profile.user?.roles?.map((role, idx) => (
                  <span key={idx} className="badge badge-primary">
                    {role}
                  </span>
                ))}

                {profile.user?.instruments?.map((instrument, idx) => (
                  <span key={idx} className="badge badge-accent">
                    {instrument}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "25px" }}>
          <button
            className={activeTab === "about" ? "btn-primary" : "btn-secondary"}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>

          <button
            className={activeTab === "featured" ? "btn-primary" : "btn-secondary"}
            onClick={() => setActiveTab("featured")}
          >
            Featured Work
          </button>

          <button
            className={activeTab === "open" ? "btn-primary" : "btn-secondary"}
            onClick={() => setActiveTab("open")}
          >
            Open Projects
          </button>

<button
  className={activeTab === "inprogress" ? "btn-primary" : "btn-secondary"}
  onClick={() => setActiveTab("inprogress")}
>
  In Progress
</button>

          <button
            className={activeTab === "completed" ? "btn-primary" : "btn-secondary"}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>

          
        </div>

        {activeTab === "about" && (
          <div className="glass-card">
            <span className="badge badge-accent">Artist Introduction</span>
            <h2 style={{ marginTop: "14px", fontSize: "1.8rem" }}>
              About {profile.stageName || profile.user?.name}
            </h2>

            <p style={{ color: "var(--text-muted)", marginTop: "18px", lineHeight: "1.8" }}>
              {profile.bio || "No bio added yet."}
            </p>
          </div>
        )}

        {activeTab === "featured" && (
          <div className="glass-card">
            <h2>🎵 Featured Work</h2>

            {portfolioItems.length === 0 ? (
              <p style={{ color: "var(--text-muted)", marginTop: "14px" }}>
                No featured work added yet.
              </p>
            ) : (
              <div style={{ display: "grid", gap: "16px", marginTop: "22px" }}>
                {portfolioItems.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      padding: "18px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <h3>{item.title}</h3>
                      <span className="badge badge-accent">{item.type}</span>
                    </div>

                    <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
                      {item.description}
                    </p>

                    <a
  href={
    item.link?.startsWith("http://") || item.link?.startsWith("https://")
      ? item.link
      : `https://${item.link}`
  }
  target="_blank"
  rel="noreferrer"
>
                      <button className="btn-secondary" style={{ marginTop: "14px" }}>
                        Open Link
                      </button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "open" && (
  <ArtistWorkSection
  title="🎧 Open Projects"
  projects={openProjects}
  empty="No open projects right now."
  sendRequest={sendRequest}
/>
)}

{activeTab === "inprogress" && (
  <ArtistWorkSection
    title="🎼 In Progress Projects"
    projects={inProgressProjects}
    empty="No projects in progress."
    sendRequest={sendRequest}
  />
)}

{activeTab === "completed" && (
  <ArtistWorkSection
    title="⭐ Completed Projects"
    projects={completedProjects}
    empty="No completed projects yet."
  />
)}
      </main>
    </div>
  );
}

function ArtistWorkSection({ title, projects, empty, sendRequest }) {
  return (
    <div className="glass-card">
      <h2>{title}</h2>

      {projects.length === 0 ? (
        <p style={{ color: "var(--text-muted)", marginTop: "15px" }}>
          {empty}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "18px",
          }}
        >
          {projects.map((project) => (
            <div
              key={project._id}
              style={{
                padding: "18px",
                border: "1px solid var(--border-color)",
                borderRadius: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <h4>{project.title}</h4>

                <span className="badge badge-accent">
                  {project.status}
                </span>
              </div>

              <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
                <strong>Created by:</strong>{" "}
                {project.owner?.name || "Unknown Artist"}
              </p>

              <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
                <strong>Genre:</strong> {project.genre}
              </p>

              <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
                <strong>Language:</strong> {project.language}
              </p>

             <p style={{ marginTop: "5px", color: "var(--text-muted)" }}>
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
</p>

              <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>
                <strong>Description:</strong>{" "}
                {project.publicDescription}
              </p>

   {project.status === "Open" && sendRequest && (
  <button
    className="btn-primary"
    style={{ marginTop: "16px" }}
    onClick={() => sendRequest(project._id)}
  >
    Apply to Project
  </button>
)}

              {project.collaborators?.length > 0 && (
                <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
                  <strong>Collaborators:</strong>{" "}
                  {project.collaborators.map((c) => c.name).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtistProfile;