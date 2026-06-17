import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ArtistCard from "../components/ArtistCard";
import API from "../services/api";
import "../App.css";

function Artists() {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    let currentUser = null;

    try {
      currentUser = JSON.parse(storedUser);
    } catch (e) {
      console.error("Error parsing logged-in user details:", e);
    }

    const fetchArtists = async () => {
      try {
        const res = await API.get("/profiles");

        const formatted = res.data.map((p) => ({
          id: p._id,
          userId: p.user?._id || p.user,
          email: p.user?.email || "",
          name: p.stageName || p.user?.name || "Independent Artist",
          roles: p.user?.roles || ["Musician"],
          instruments: p.user?.instruments || [],
          genres:
            p.genres && p.genres.length > 0
              ? p.genres
              : [p.user?.genre || "Music"],
          location: p.location || "Online",
          bio: p.bio || "TuneLink music creator.",
          badges: p.badges || [],
          profileVisitors: p.profileVisitors || 0,
        }));

        const otherArtists = formatted.filter((artist) => {
          if (!currentUser) return true;

          const currentUserId = currentUser.id || currentUser._id;

          return (
            artist.userId !== currentUserId &&
            artist.email !== currentUser.email
          );
        });

        setArtists(otherArtists);
        setFilteredArtists(otherArtists);
      } catch (err) {
        console.error("Error fetching artist profiles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [navigate]);

  useEffect(() => {
    let result = [...artists];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (artist) =>
          artist.name.toLowerCase().includes(query) ||
          artist.bio.toLowerCase().includes(query) ||
          artist.location.toLowerCase().includes(query) ||
          artist.roles.some((role) => role.toLowerCase().includes(query)) ||
          artist.instruments.some((instrument) =>
            instrument.toLowerCase().includes(query)
          ) ||
          artist.genres.some((genre) => genre.toLowerCase().includes(query))
      );
    }

    if (selectedRole !== "All") {
      result = result.filter((artist) => {
        if (selectedRole === "Instrumentalist") {
          return (
            artist.roles.some(
              (role) => role.toLowerCase() === "instrumentalist"
            ) || artist.instruments.length > 0
          );
        }

        return artist.roles.some(
          (role) => role.toLowerCase() === selectedRole.toLowerCase()
        );
      });
    }

    if (selectedGenre !== "All") {
      result = result.filter((artist) =>
        artist.genres.some(
          (genre) => genre.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    setFilteredArtists(result);
  }, [searchQuery, selectedRole, selectedGenre, artists]);

  const roles = [
    "All",
    "Singer",
    "Lyricist",
    "Producer",
    "Instrumentalist",
    "Composer",
    "Rapper",
    "Mix Engineer",
  ];

  const genres = [
    "All",
    "Pop",
    "Indie Pop",
    "Bollywood",
    "Acoustic",
    "R&B",
    "Hip Hop",
    "Lo-Fi",
    "Rock",
    "Classical",
    "Folk",
    "Alternative Rock",
  ];

  return (
    <div className="app">
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      <Navbar />

      <main
        style={{
          maxWidth: "1200px",
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
            <span className="badge badge-primary" style={{ marginBottom: "12px" }}>
              Explore Community
            </span>

            <h2 style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}>
              Artist Directory
            </h2>

            <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
              Discover singers, lyricists, producers and instrumentalists for your next collaboration.
            </p>
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            marginBottom: "35px",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div style={{ flex: "1 1 300px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: "600",
                textTransform: "uppercase",
                color: "var(--text-dimmed)",
                marginBottom: "8px",
              }}
            >
              Search Artist
            </label>

            <input
              type="text"
              placeholder="Search by name, bio, role, genre or instrument..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ flex: "1 1 180px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: "600",
                textTransform: "uppercase",
                color: "var(--text-dimmed)",
                marginBottom: "8px",
              }}
            >
              Role
            </label>

            <select
              className="form-input"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ width: "100%", background: "#0a0a0f" }}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "All" ? "All Roles" : role}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1 1 180px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                fontWeight: "600",
                textTransform: "uppercase",
                color: "var(--text-dimmed)",
                marginBottom: "8px",
              }}
            >
              Genre
            </label>

            <select
              className="form-input"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{ width: "100%", background: "#0a0a0f" }}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === "All" ? "All Genres" : genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div
            className="glass-card"
            style={{
              padding: "80px 40px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            Loading active artist profiles...
          </div>
        ) : filteredArtists.length > 0 ? (
          <div className="grid-3">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div
            className="glass-card"
            style={{
              padding: "80px 40px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>
              No matching artists found
            </h3>

            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Try changing your search or filters to discover more creators.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Artists;