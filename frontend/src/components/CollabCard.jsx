import "../App.css";

function CollabCard({ project }) {
  // Fallback defaults if no project prop is passed
  const defaultProject = {
    title: "Melody for 'Chasing Light'",
    creatorName: "Kavya Vocals",
    rolesNeeded: ["Lyricist", "Composer"],
    genres: ["Indie Pop", "Acoustic"],
    description: "I've recorded a basic vocal melody and acoustic guitar scratch track. Looking for a lyricist to help draft poetic verses and a composer to add string arrangements.",
    matchScore: 92,
    datePosted: "2 hours ago",
    ...project
  };

  const { title, creatorName, rolesNeeded, genres, description, matchScore, datePosted } = defaultProject;

  return (
    <div className={`glass-card collab-card ${matchScore >= 90 ? "high-match" : ""}`}>
      <div className="collab-header">
        <div style={{ textAlign: "left" }}>
          <h3 className="collab-title">{title}</h3>
          <span style={{ fontSize: "0.8rem", color: "var(--text-dimmed)", marginTop: "4px", display: "inline-block" }}>
            by {creatorName} • {datePosted}
          </span>
        </div>
        {matchScore && (
          <div className="collab-match-badge" title="AI Recommendation Score">
            ✨ {matchScore}% Match
          </div>
        )}
      </div>

      <p className="collab-details">{description}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
        {rolesNeeded.map((role, idx) => (
          <span key={idx} className="badge badge-primary">
            Needs {role}
          </span>
        ))}
        {genres.map((genre, idx) => (
          <span key={idx + 10} className="badge badge-secondary" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.06)", color: "var(--text-muted)", textTransform: "none" }}>
            {genre}
          </span>
        ))}
      </div>

      <div className="collab-meta">
        <div className="collab-user">
          <div 
            className="collab-avatar" 
            style={{ 
              background: "linear-gradient(45deg, var(--secondary), var(--accent))",
              color: "#050508",
              fontWeight: "800",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {creatorName.charAt(0)}
          </div>
          <span style={{ fontWeight: "600", color: "var(--text-main)" }}>{creatorName}</span>
        </div>

        <button className="btn-accent" style={{ padding: "8px 18px", fontSize: "0.8rem", borderRadius: "20px" }}>
          Apply to Project
        </button>
      </div>
    </div>
  );
}

export default CollabCard;
