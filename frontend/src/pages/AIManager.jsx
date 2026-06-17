import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../App.css";

function AIMatch() {
  const navigate = useNavigate();

  const [isScanning, setIsScanning] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [message, setMessage] = useState("");
const [msg, setMsg] = useState("");
  const fetchMatches = async () => {
    try {
      const res = await API.get("/ai/collab-matches");

      setMatchResults(res.data.matches || []);
      setMessage(res.data.message || "");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load AI matches");
      setMatchResults([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    fetchMatches();

    const timer = setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRescan = async () => {
    setIsScanning(true);
    setShowResults(false);

    await fetchMatches();

    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 1400);
  };

  const inviteArtist = async (artistUserId, projectId) => {
  try {
    await API.post("/collabs/invite", {
      receiverId: artistUserId,
      projectId,
      message: "I think you would be a good fit for my project.",
    });

    setMsg("Invite sent successfully ✅");

    setTimeout(() => {
      setMsg("");
    }, 3000);
  } catch (err) {
    setMsg(err.response?.data?.message || "Failed to send invite");

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
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      <Navbar />

      <main
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "40px auto",
          padding: "0 20px",
          flex: 1,
          textAlign: "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <span className="badge badge-accent" style={{ marginBottom: "12px" }}>
              AI Engine
            </span>

            <h2 style={{ fontSize: "2.2rem", letterSpacing: "-0.02em" }}>
              Smart Collaboration Matcher
            </h2>

            <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
              Matches are based on your open project roles, required instruments,
              genre, and artist skills.
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={handleRescan}
            disabled={isScanning}
            style={{ borderRadius: "20px", padding: "10px 24px" }}
          >
            {isScanning ? "Scanning..." : "Rescan Matches"}
          </button>
        </div>

        {isScanning && (
          <div
            className="glass-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "90px 40px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                border: "4px solid rgba(0, 240, 255, 0.15)",
                borderTopColor: "var(--accent)",
                animation: "spin 0.8s linear infinite",
                marginBottom: "30px",
                boxShadow: "0 0 20px var(--accent-glow)",
              }}
            />

            <h3 style={{ fontSize: "1.4rem", marginBottom: "10px" }}>
              Scanning Your Open Project...
            </h3>

            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: "480px",
                lineHeight: "1.6",
                fontSize: "0.92rem",
              }}
            >
              Checking required roles, instruments, genres, and artist profiles
              to suggest suitable collaborators.
            </p>
          </div>
        )}

        {showResults && (
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {matchResults.length > 0 ? (
              <>
                <div
                  className="glass-card"
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                    padding: "20px 30px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "1.15rem",
                        color: "var(--success)",
                        marginBottom: "4px",
                      }}
                    >
                      Scan Complete!
                    </h4>

                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                      Found {matchResults.length} artist
                      {matchResults.length === 1 ? "" : "s"} matching your open
                      project requirements.
                    </p>
                  </div>

                  <span
                    className="badge"
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "var(--success)",
                      padding: "8px 18px",
                      borderRadius: "20px",
                    }}
                  >
                    {matchResults.length} Match
                    {matchResults.length === 1 ? "" : "es"} Found
                  </span>
                </div>

                <div className="grid-3">
                  {matchResults.map((match, index) => {
                    const artist = match.artist || {};
const user = artist.user || {};
const profileId = match.profileId;
const userId = match.artistId;

                    return (
                      <div key={index} className="glass-card">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "12px",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <h3>
                              {user.name ||
                                artist.stageName ||
                                "Independent Artist"}
                            </h3>

                            <p
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.85rem",
                                marginTop: "4px",
                              }}
                            >
                              For project:{" "}
                              <strong>{match.projectTitle || "Your Open Project"}</strong>
                            </p>
                          </div>

                          <span className="badge badge-accent">
                            {match.matchScore || 0}% Match
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            marginTop: "16px",
                          }}
                        >
                          {user.roles?.map((role, i) => (
                            <span key={i} className="badge badge-primary">
                              {role}
                            </span>
                          ))}

                          {user.instruments?.map((instrument, i) => (
                            <span key={i} className="badge badge-accent">
                              {instrument}
                            </span>
                          ))}
                        </div>

                        {match.requiredRoles?.length > 0 && (
                          <p
                            style={{
                              color: "var(--text-muted)",
                              marginTop: "14px",
                              fontSize: "0.9rem",
                            }}
                          >
                            <strong>Project needs:</strong>{" "}
                            {match.requiredRoles.join(", ")}
                          </p>
                        )}

                        {match.reasons?.length > 0 ? (
                          <div style={{ marginTop: "14px" }}>
                            {match.reasons.map((reason, i) => (
                              <p
                                key={i}
                                style={{
                                  color: "var(--text-muted)",
                                  marginTop: "6px",
                                  fontSize: "0.9rem",
                                }}
                              >
                                ✓ {reason}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: "var(--text-muted)", marginTop: "14px" }}>
                            This artist matches your project requirements.
                          </p>
                        )}

                        {match.aiExplanation && (
                          <p
                            style={{
                              color: "var(--text-muted)",
                              marginTop: "14px",
                              lineHeight: "1.5",
                              fontSize: "0.9rem",
                            }}
                          >
                            {match.aiExplanation}
                          </p>
                        )}

                    {profileId ? (
  <Link to={`/artists/${profileId}`}>
  <button
    className="btn-primary"
    style={{ marginTop: "18px", width: "100%" }}
  >
    View Profile
  </button>
</Link>
) : (
  <button
    className="btn-secondary"
    style={{
      marginTop: "18px",
      width: "100%",
      cursor: "not-allowed",
      opacity: 0.7,
    }}
    disabled
  >
    Profile unavailable
  </button>
)}
<button
  className="btn-secondary"
  style={{ marginTop: "10px", width: "100%" }}
  onClick={() => inviteArtist(userId, match.projectId)}
>
  Invite Artist
</button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div
                className="glass-card"
                style={{ padding: "60px 40px", textAlign: "center" }}
              >
                <h4 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>
                  No AI matches found
                </h4>

                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {message ||
                    "Create an open project with roles or instruments needed to get matches."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AIMatch;