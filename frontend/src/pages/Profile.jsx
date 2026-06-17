import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../App.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Artist Name",
    email: "artist@studio.com",
    role: "Singer"
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [requestTab, setRequestTab] = useState("received");

  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState(["Music"]);
  const [equipment, setEquipment] = useState("");
  const [badges, setBadges] = useState([]);

  const [allWorkProjects, setAllWorkProjects] = useState([]);

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);

const [portfolioForm, setPortfolioForm] = useState({
  title: "",
  type: "YouTube",
  link: "",
  description: ""
});

  const [tempEquipment, setTempEquipment] = useState("");

  const fetchAllProfileData = async () => {
    try {
      const profileRes = await API.get("/profiles/me");
      const profile = profileRes.data;
  setBio(profile.bio || "");
      setEquipment(profile.equipment || "");
      setGenres(profile.genres || ["Music"]);
      setBadges(profile.badges || []);
      setTempBio(profile.bio || "");
      setTempEquipment(profile.equipment || "");
    } catch (err) {
      console.log("No profile found yet");
    }

    try {
      const workRes = await API.get("/projects/work/my");

      const owned = (workRes.data.ownedProjects || []).map((project) => ({
        ...project,
        myRoleType: "Creator"
      }));

      const collab = (workRes.data.collaborationProjects || []).map((project) => ({
        ...project,
        myRoleType: "Collaborator"
      }));

      setAllWorkProjects([...owned, ...collab]);
    } catch (err) {
      console.log("Work projects not loaded");
    }

    try {
      const sentRes = await API.get("/collabs/sent");
      setSentRequests(sentRes.data || []);
    } catch (err) {
      console.log("Sent requests not loaded");
    }

    try {
      const receivedRes = await API.get("/collabs/received");
      setReceivedRequests(receivedRes.data || []);
    } catch (err) {
      console.log("Received requests not loaded");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Error parsing user details");
    }

    fetchAllProfileData();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const res = await API.post("/profiles", {
        stageName: user.name,
        bio: tempBio,
        genres,
        equipment: tempEquipment,
        skills: tempEquipment.split(",").map((s) => s.trim()).filter(Boolean),
        location: "Online",
        demoLink: "",
        badges
      });

      setBio(res.data.profile.bio || "");
      setEquipment(res.data.profile.equipment || "");
      setGenres(res.data.profile.genres || ["Music"]);
      setBadges(res.data.profile.badges || []);
      setIsEditingOverview(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleVerify = () => {
    alert(
      "Verification requires profile completion, demo links, completed projects, and admin approval."
    );
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await API.put(`/collabs/${id}/status`, { status });
      fetchAllProfileData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update request");
    }
  };

  const openProjects = allWorkProjects.filter((p) => p.status === "Open");
  const progressProjects = allWorkProjects.filter((p) => p.status === "In Progress");
  const completedProjects = allWorkProjects.filter((p) => p.status === "Completed");
  const addPortfolio = async () => {
  try {
   const finalLink =
  portfolioForm.link.startsWith("http://") || portfolioForm.link.startsWith("https://")
    ? portfolioForm.link
    : `https://${portfolioForm.link}`;

const res = await API.post("/portfolio", {
  ...portfolioForm,
  link: finalLink,
});

    setPortfolioItems([res.data, ...portfolioItems]);

    setPortfolioForm({
      title: "",
      type: "YouTube",
      link: "",
      description: ""
    });
  } catch (err) {
    alert("Failed to add work");
  }
};

const deletePortfolio = async (id) => {
  await API.delete(`/portfolio/${id}`);

  setPortfolioItems(
    portfolioItems.filter((item) => item._id !== id)
  );
};

const [isEditingOverview, setIsEditingOverview] = useState(false);

const [tempBio, setTempBio] = useState("");
const [tempRoles, setTempRoles] = useState([]);
const [tempInstruments, setTempInstruments] = useState([]);
const roleOptions = [
  "Singer",
  "Lyricist",
  "Producer",
  "Composer",
  "Rapper",
  "Mix Engineer",
];

const instrumentOptions = [
  "Acoustic Guitar",
  "Electric Guitar",
  "Bass Guitar",
  "Piano",
  "Djambe",
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
const startEditingRoles = () => {
  setTempRoles(user.roles || []);
  setTempInstruments(user.instruments || []);
  setisEditingOverview(true);
};

const saveRolesInstruments = async () => {
  try {
    const res = await API.put("/auth/me", {
      roles: tempRoles,
      instruments: tempInstruments,
    });

    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    setIsEditingOverview(false);
  } catch (err) {
    alert("Failed to update roles/instruments");
  }
};
useEffect(() => {
  if (!user?.id) return;

  const fetchPortfolio = async () => {
    try {
      const portfolioRes = await API.get(`/portfolio/${user.id}`);
      setPortfolioItems(portfolioRes.data || []);
    } catch (err) {
      console.log("Portfolio not loaded");
    }
  };

  fetchPortfolio();
}, [user]);

const withdrawRequest = async (id) => {
  if (!window.confirm("Withdraw this collaboration request?")) return;

  try {
    await API.delete(`/collabs/${id}/withdraw`);
    setSentRequests(sentRequests.filter((req) => req._id !== id));
  } catch (err) {
    alert(err.response?.data?.message || "Failed to withdraw request");
  }
};
const updateProjectStatus = async (projectId, status) => {
  try {
    await API.put(`/projects/${projectId}/status`, { status });
    fetchAllProfileData();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to update project status");
  }
};
  return (
    <div className="app">
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      <Navbar />

      <main style={{ maxWidth: "1000px", width: "100%", margin: "40px auto", padding: "0 20px", flex: 1 }}>
        
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "25px" }}>
          <button className={activeTab === "overview" ? "btn-primary" : "btn-secondary"} onClick={() => setActiveTab("overview")}>
            Overview
          </button>

          <button className={activeTab === "work" ? "btn-primary" : "btn-secondary"} onClick={() => setActiveTab("work")}>
            My Work
          </button>

             
          <button className={activeTab === "requests" ? "btn-primary" : "btn-secondary"} onClick={() => setActiveTab("requests")}>
            Collab Requests {receivedRequests.filter((r) => r.status === "Pending").length > 0 && `🔔 ${receivedRequests.filter((r) => r.status === "Pending").length}`}
          </button>

          {!badges.includes("Verified") && (
        <button className="btn-accent" onClick={handleVerify}>
          Apply for Verification
        </button>
      )}
        </div>

       {activeTab === "overview" && (
  <div className="glass-card">
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1 rem",
          fontWeight: "800",
          color: "white",
          flexShrink: 0
        }}
      >
        {user.name?.charAt(0)}
      </div>

      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: "2.2rem", marginBottom: "10px" }}>
          {user.name} {badges.includes("Verified") && "✓"}
        </h2>

        <p style={{ color: "var(--text-muted)", marginBottom: "15px" }}>
          {user.email}
        </p>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
  {user.roles?.map((role, index) => (
    <span key={index} className="badge badge-primary">
      {role}
    </span>
  ))}

  {user.instruments?.map((instrument, index) => (
    <span key={index} className="badge badge-accent">
      {instrument}
    </span>
  ))}
</div>

<div style={{ marginTop: "15px" }}>
  {isEditingOverview ? (
        <textarea
          className="form-input"
          rows="6"
          value={tempBio}
          onChange={(e) => setTempBio(e.target.value)}
          placeholder="Example: I am an indie-pop singer who loves emotional melodies and acoustic collaborations..."
          style={{ marginTop: "25px", width: "100%", resize: "vertical" }}
        />
      ) : (
        <div
          style={{
            marginTop: "25px",
            padding: "24px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          <p style={{ color: "var(--text-muted)", lineHeight: "1.8" }}>
            {bio ||
              "No bio added yet. Add a short intro about your music style, voice, genre, and collaboration vibe."}
          </p>
        </div>
      )}

  
  {isEditingOverview && (
  <div className="glass-card" style={{ marginTop: "20px" }}>
    <h3>Edit Roles</h3>

    <div className="role-checkbox-grid">
      {roleOptions.map((role) => (
        <label key={role} className="role-checkbox">
          <input
            type="checkbox"
            checked={tempRoles.includes(role)}
            onChange={() =>
              setTempRoles((prev) =>
                prev.includes(role)
                  ? prev.filter((r) => r !== role)
                  : [...prev, role]
              )
            }
          />
          <span>{role}</span>
        </label>
      ))}
    </div>

    <h3 style={{ marginTop: "25px" }}>Edit Instruments</h3>

    <div className="role-checkbox-grid">
      {instrumentOptions.map((instrument) => (
        <label key={instrument} className="role-checkbox">
          <input
            type="checkbox"
            checked={tempInstruments.includes(instrument)}
            onChange={() =>
              setTempInstruments((prev) =>
                prev.includes(instrument)
                  ? prev.filter((i) => i !== instrument)
                  : [...prev, instrument]
              )
            }
          />
          <span>{instrument}</span>
        </label>
      ))}
    </div>

    <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
      <div style={{ marginTop: "25px" }}>
  <button
    className="btn-secondary"
    onClick={() => setIsEditingOverview(false)}
  >
    Cancel
  </button>
</div>
    </div>
  </div>
)}
</div>
      </div>
    </div>

    <div
      style={{
        marginTop: "35px",
        paddingTop: "28px",
        borderTop: "1px solid rgba(255,255,255,0.08)"
      }}
    >
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    textAlign: "center"
  }}
>
        

       <button
  className={isEditingOverview ? "btn-primary" : "btn-secondary"}
  onClick={async () => {
    if (isEditingOverview) {
      await handleSave();
      await saveRolesInstruments();
      setIsEditingOverview(false);
    } else {
      setTempBio(bio);
      setTempRoles(user.roles || []);
      setTempInstruments(user.instruments || []);
      setIsEditingOverview(true);
    }
  }}
>
  {isEditingOverview ? "Save Profile" : "Edit Profile"}
</button>
      </div>

          </div>
  </div>
)}

        {activeTab === "work" && (
          
  <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "15px"
  }}
>
  <div>
    <h2>Projects & Portfolio</h2>
  </div>

  <Link to="/create-project">
    <button className="btn-primary">
      + Create Project
    </button>
  </Link>
</div>
   <WorkSection
  title="🎧 Open for Collaborators"
  projects={openProjects}
  empty="No open projects right now."
  updateProjectStatus={updateProjectStatus}
  refreshProjects={fetchAllProfileData}
/>

   <WorkSection
  title="🎼 In Progress Collaborations"
  projects={progressProjects}
  empty="No collaborations in progress yet."
  updateProjectStatus={updateProjectStatus}
  refreshProjects={fetchAllProfileData}
/>
   <WorkSection
  title="⭐ Completed Projects"
  projects={completedProjects}
  empty="No completed projects yet."
  updateProjectStatus={updateProjectStatus}
  refreshProjects={fetchAllProfileData}
/>

    <div style={{ marginTop: "25px", display: "flex", flexDirection: "column", gap: "15px" }}>
        {portfolioItems.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No featured work added yet.</p>
        ) : (
          portfolioItems.map((item) => (
            <div
              key={item._id}
              style={{
                padding: "18px",
                border: "1px solid var(--border-color)",
                borderRadius: "14px",
              }}
            >
             <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
  }}
>
  <h4 style={{ margin: 0 }}>{item.title}</h4>

  <span className="badge badge-accent">
    {item.type}
  </span>
</div>

              <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
                {item.description}
              </p>

              <a href={item.link} target="_blank" rel="noreferrer">
                <button className="btn-secondary" style={{ marginTop: "15px", fontSize: "0.9rem", padding: "8px 14px" }}>
                  Open Link
                </button>
              </a>

              <button
                className="btn-accent"
                style={{ marginLeft: "10px", fontSize: "0.9rem", padding: "8px 14px" }}
                onClick={() => deletePortfolio(item._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

    <FeaturedWork
      portfolioItems={portfolioItems}
      portfolioForm={portfolioForm}
      setPortfolioForm={setPortfolioForm}
      addPortfolio={addPortfolio}
      deletePortfolio={deletePortfolio}
    />
    
  </div>
)}
{activeTab === "portfolio" && (
  <div className="glass-card">

    <h3>Add Previous Work</h3>

    <input
      className="form-input"
      placeholder="Title"
      value={portfolioForm.title}
      onChange={(e) =>
        setPortfolioForm({
          ...portfolioForm,
          title: e.target.value
        })
      }
    />

    <select
      className="form-select"
      style={{ marginTop: "15px" }}
      value={portfolioForm.type}
      onChange={(e) =>
        setPortfolioForm({
          ...portfolioForm,
          type: e.target.value
        })
      }
    >
      <option>YouTube</option>
      <option>Spotify</option>
      <option>Instagram</option>
      <option>SoundCloud</option>
      <option>Demo</option>
      <option>Instrument Cover</option>
    </select>

    <input
      className="form-input"
      style={{ marginTop: "15px" }}
      placeholder="Link"
      value={portfolioForm.link}
      onChange={(e) =>
        setPortfolioForm({
          ...portfolioForm,
          link: e.target.value
        })
      }
    />

    <textarea
      className="form-input"
      rows="3"
      style={{ marginTop: "15px" }}
      placeholder="Description"
      value={portfolioForm.description}
      onChange={(e) =>
        setPortfolioForm({
          ...portfolioForm,
          description: e.target.value
        })
      }
    />

    <button
      className="btn-primary"
      style={{ marginTop: "15px" }}
      onClick={addPortfolio}
    >
      Add Work
    </button>

    <div
      style={{
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
    >
      {portfolioItems.map((item) => (
        <div key={item._id} className="glass-card ">

          <h4>{item.title}</h4>

          <span className="badge badge-accent">
            {item.type}
          </span>

          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "10px"
            }}
          >
            {item.description}
          </p>

          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
          >
            <button
              className="btn-secondary"
              style={{ marginTop: "15px" }}
            >
              Open Link
            </button>
          </a>

          <button
            className="btn-accent"
            style={{ marginLeft: "10px" }}
            onClick={() => deletePortfolio(item._id)}
          >
            Delete
          </button>

        </div>
      ))}
    </div>

  </div>
)}
        {activeTab === "requests" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <button
                className={requestTab === "received" ? "btn-primary" : "btn-secondary"}
                onClick={() => setRequestTab("received")}
              >
                Received
              </button>

              <button
                className={requestTab === "sent" ? "btn-primary" : "btn-secondary"}
                onClick={() => setRequestTab("sent")}
              >
                Sent
              </button>
            </div>
            

            {requestTab === "received" ? (
              <RequestList requests={receivedRequests} type="received" updateRequestStatus={updateRequestStatus} />
            ) : (
             <RequestList
  requests={sentRequests}
  type="sent"
  withdrawRequest={withdrawRequest}
/>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function WorkSection({ title, projects, empty, updateProjectStatus, refreshProjects }) {
  return (
    <div className="glass-card">
      <h3>{title}</h3>

      {projects.length === 0 ? (
        <p style={{ color: "var(--text-muted)", marginTop: "15px" }}>{empty}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "18px" }}>
          {projects.map((project) => (
   <ProjectWorkCard
  key={project._id}
  project={project}
  updateProjectStatus={updateProjectStatus}
  refreshProjects={refreshProjects}
/>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectWorkCard({ project, updateProjectStatus, refreshProjects }) {
  const isCreator = project.myRoleType === "Creator";
  const [isEditingProject, setIsEditingProject] = useState(false);

const [editProjectData, setEditProjectData] = useState({
  title: project.title || "",
  genre: project.genre || "Indie Pop",
  language: project.language || "Hindi",
  mood: project.mood || "Emotional",
  stage: project.stage || "Idea Only",
  publicDescription: project.publicDescription || "",
  requiredRoles: project.requiredRoles || [],
  requiredInstruments: project.requiredInstruments || [],
  status: project.status || "Open",
});

const roleOptions = [
  "Singer",
  "Lyricist",
  "Producer",
  "Instrumentalist",
  "Composer",
  "Rapper",
  "Mix Engineer",
];

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

const handleEditChange = (e) => {
  setEditProjectData({
    ...editProjectData,
    [e.target.name]: e.target.value,
  });
};

const handleEditRoleChange = (role) => {
  setEditProjectData((prev) => {
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

const handleEditInstrumentChange = (instrument) => {
  setEditProjectData((prev) => ({
    ...prev,
    requiredInstruments: prev.requiredInstruments.includes(instrument)
      ? prev.requiredInstruments.filter((i) => i !== instrument)
      : [...prev.requiredInstruments, instrument],
  }));
};

const saveProjectEdit = async () => {
  try {
    await API.put(`/projects/${project._id}`, editProjectData);
    setIsEditingProject(false);
    refreshProjects();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to update project");
  }
};

  return (
    <div style={{ padding: "18px", border: "1px solid var(--border-color)", borderRadius: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <h4>{project.title}</h4>

        <span className={project.status === "Completed" ? "badge badge-primary" : "badge badge-accent"}>
          {project.status === "Completed" ? "Portfolio" : project.status}
        </span>
      </div>

      <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
       <strong> Created by: </strong>{isCreator ? "You" : project.owner?.name || "Unknown Artist"}
      </p>

      <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
       <strong> Genre: </strong>{project.genre}
      </p>

<p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
       <strong> Language: </strong>{project.language}
       </p>


{project.requiredRoles?.length > 0 && (
  <div style={{ marginTop: "12px", color: "var(--text-muted)" }}>
    <strong>Looking for:</strong>{" "}
    {project.requiredRoles
      .filter((role) => role !== "Instrumentalist")
      .join(", ")}

    {project.requiredRoles.includes("Instrumentalist") &&
      project.requiredInstruments?.length > 0 && (
        <>
          {project.requiredRoles.filter((role) => role !== "Instrumentalist").length > 0
            ? ", "
            : ""}
          Instrumentalist ({project.requiredInstruments.join(", ")})
        </>
      )}
  </div>
)}

      <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>
        <strong>Description: </strong>{project.publicDescription}
      </p>

      {project.collaborators?.length > 0 && (
        <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
         <strong> Collaborators: </strong>{project.collaborators.map((c) => c.name).join(", ")}
        </p>
      )}
     {isCreator && !isEditingProject && (
  <button
    className="btn-secondary"
    style={{ marginTop: "15px" }}
    onClick={() => setIsEditingProject(true)}
  >
    Edit Project
  </button>
)}
{isCreator && isEditingProject && (
  <div
    style={{
      marginTop: "18px",
      padding: "18px",
      border: "1px solid var(--border-color)",
      borderRadius: "14px",
    }}
  >
    <h4>Edit Project</h4>

    <input
      className="form-input"
      name="title"
      value={editProjectData.title}
      onChange={handleEditChange}
      placeholder="Project title"
      style={{ marginTop: "12px" }}
    />

    <div className="grid-2" style={{ marginTop: "14px" }}>
      <select
        className="form-select"
        name="genre"
        value={editProjectData.genre}
        onChange={handleEditChange}
      >
        <option value="Indie Pop">Indie Pop</option>
        <option value="Acoustic">Acoustic</option>
        <option value="Lo-Fi Hip Hop">Lo-Fi Hip Hop</option>
        <option value="Rock / Metal">Rock / Metal</option>
        <option value="R&B / Soul">R&B / Soul</option>
        <option value="Bollywood">Bollywood</option>
      </select>

      <select
        className="form-select"
        name="language"
        value={editProjectData.language}
        onChange={handleEditChange}
      >
        <option value="Hindi">Hindi</option>
        <option value="English">English</option>
        <option value="Hindi / English">Hindi / English</option>
        <option value="Gujarati">Gujarati</option>
        <option value="Punjabi">Punjabi</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <textarea
      className="form-input"
      name="publicDescription"
      rows="4"
      value={editProjectData.publicDescription}
      onChange={handleEditChange}
      placeholder="Project description"
      style={{ marginTop: "14px", resize: "vertical" }}
    />

    <div style={{ marginTop: "18px" }}>
      <h4>Roles Needed</h4>

      <div className="role-checkbox-grid">
        {roleOptions.map((role) => (
          <label key={role} className="role-checkbox">
            <input
              type="checkbox"
              checked={editProjectData.requiredRoles.includes(role)}
              onChange={() => handleEditRoleChange(role)}
            />
            <span>{role}</span>
          </label>
        ))}
      </div>
    </div>

    {editProjectData.requiredRoles.includes("Instrumentalist") && (
      <div style={{ marginTop: "18px" }}>
        <h4>Instruments Needed</h4>

        <div className="role-checkbox-grid">
          {instrumentOptions.map((instrument) => (
            <label key={instrument} className="role-checkbox">
              <input
                type="checkbox"
                checked={editProjectData.requiredInstruments.includes(instrument)}
                onChange={() => handleEditInstrumentChange(instrument)}
              />
              <span>{instrument}</span>
            </label>
          ))}
        </div>
      </div>
    )}

    <div style={{ marginTop: "18px" }}>
      <h4>Project Status</h4>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        <button
          className={editProjectData.status === "Open" ? "btn-primary" : "btn-secondary"}
          onClick={() =>
            setEditProjectData({ ...editProjectData, status: "Open" })
          }
        >
          Mark Open
        </button>

        <button
          className={editProjectData.status === "In Progress" ? "btn-primary" : "btn-secondary"}
          onClick={() =>
            setEditProjectData({ ...editProjectData, status: "In Progress" })
          }
        >
          Mark In Progress
        </button>

        <button
          className={editProjectData.status === "Completed" ? "btn-primary" : "btn-secondary"}
          onClick={() =>
            setEditProjectData({ ...editProjectData, status: "Completed" })
          }
        >
          Mark Completed
        </button>
      </div>
    </div>

    <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
      <button className="btn-primary" onClick={saveProjectEdit}>
        Save Project
      </button>

      <button className="btn-secondary" onClick={() => setIsEditingProject(false)}>
        Cancel
      </button>
    </div>
  </div>
)}
    </div>
  );
}
function FeaturedWork({
  portfolioItems,
  portfolioForm,
  setPortfolioForm,
  addPortfolio,
  deletePortfolio,
}) {
  return (
    <div className="glass-card">
      <h3>🎵 Featured Work</h3>
      <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
        Add links to your songs, reels, demos, covers or music work.
      </p>

      <div style={{ marginTop: "20px" }}>
        <input
          className="form-input"
          placeholder="Title"
          value={portfolioForm.title}
          onChange={(e) =>
            setPortfolioForm({ ...portfolioForm, title: e.target.value })
          }
        />

        <select
          className="form-select"
          style={{ marginTop: "15px" }}
          value={portfolioForm.type}
          onChange={(e) =>
            setPortfolioForm({ ...portfolioForm, type: e.target.value })
          }
        >
          <option>YouTube</option>
          <option>Spotify</option>
          <option>Instagram</option>
          <option>SoundCloud</option>
          <option>Demo</option>
          <option>Instrument Cover</option>
        </select>

        <input
          className="form-input"
          style={{ marginTop: "15px" }}
          placeholder="Link"
          value={portfolioForm.link}
          onChange={(e) =>
            setPortfolioForm({ ...portfolioForm, link: e.target.value })
          }
        />

        <textarea
          className="form-input"
          rows="3"
          style={{ marginTop: "15px" }}
          placeholder="Description"
          value={portfolioForm.description}
          onChange={(e) =>
            setPortfolioForm({ ...portfolioForm, description: e.target.value })
          }
        />

        <button
          className="btn-primary"
          style={{ marginTop: "15px" }}
          onClick={addPortfolio}
        >
          Add Featured Work
        </button>
      </div>

      
    </div>
  );
}

function RequestList({
  requests,
  type,
  updateRequestStatus,
  withdrawRequest,
}) {
  if (requests.length === 0) {
    return (
      <div className="glass-card">
        <h3>No {type} requests yet</h3>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {requests.map((req) => (
        <div key={req._id} className="glass-card">
          <h3>{req.project?.title}</h3>

          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
            {req.project?.genre} • {req.project?.language}
          </p>

          <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>
            {type === "received" ? "From" : "To"}:{" "}
            <strong>{type === "received" ? req.sender?.name : req.receiver?.name}</strong>
          </p>

          {req.message && (
            <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>
              “{req.message}”
            </p>
          )}

          <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <span className="badge badge-accent">{req.status}</span>

            {type === "received" && req.status === "Pending" && (
              <>
                <button style={{ fontSize: "0.9rem", padding: "8px 14px" }}
                  className="btn-primary" onClick={() => updateRequestStatus(req._id, "Accepted")}>
                  Accept
                </button>

                <button style={{fontSize: "0.9rem", padding: "8px 14px" }}
                  className="btn-secondary" onClick={() => updateRequestStatus(req._id, "Rejected")}>
                  Reject
                </button>
              </>
            )}
            {type === "sent" && req.status === "Pending" && (
  <button
    className="btn-secondary"
    style={{ fontSize: "0.9rem", padding: "8px 14px" }}
    onClick={() => withdrawRequest(req._id)}
  >
    Withdraw Request
  </button>
)}
          </div>
        </div>
      ))}
    
    </div>
  );
}

export default Profile;