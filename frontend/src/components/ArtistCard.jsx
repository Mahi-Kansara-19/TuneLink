import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function ArtistCard({ artist }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultArtist = {
    id: "",
    name: "Independent Artist",
    roles: ["Musician"],
    genres: ["Music"],
    bio: "TuneLink music creator looking for collaborations.",
    badges: [],
    profileVisitors: 0,
    ...artist,
  };

  const {
    id,
    name,
    roles,
    genres,
    bio,
    badges,
    profileVisitors,
  } = defaultArtist;

  return (
    <div className="glass-card artist-card">
      <div className="artist-card-header">
        <div
          className="artist-avatar"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: "800",
            color: "white",
          }}
        >
          {name?.charAt(0)}
        </div>

        <div className="artist-info">
          <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {name}
            {badges?.includes("Verified") && <span>✓</span>}
          </h4>

          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {roles?.slice(0, 2).map((role, index) => (
              <span key={index} className="badge badge-primary">
                {role}
              </span>
            ))}

            
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--text-muted)",
           marginTop:"12px",
  marginBottom:"5px",
          minHeight: "48px",
          lineHeight: "1.5",
        }}
      >
        {bio}
      </p>

      <div className="artist-tag-list">
        {genres?.map((genre, idx) => (
          <span 
            key={idx}
            className="badge"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              textTransform: "none",
            }}
            
          >
            {genre}
          </span>
        ))}
      </div>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          marginTop: "16px",
        }}
      >
        👤 {profileVisitors || 0} profile visitors
        
      </p>
      <Link
to={`/artists/${artist.name
.toLowerCase()
.replace(/\s+/g,"-")}/${id}`}
>
        <button
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            marginTop: "18px",
          }}
        >
          View Profile
        </button>
      </Link>
    </div>
  );
}

export default ArtistCard;