import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ArtistCard from "../components/ArtistCard";
import CollabCard from "../components/CollabCard";
import API from "../services/api";
import "../App.css";
function Home() {
  const [stats, setStats] = useState({ totalArtists: 0, activeCollaborations: 0, algorithmFree: 100 });
  const [artists, setArtists] = useState([]);
  const [collabs, setCollabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchRealData = async () => {
      try {
        // Fetch real-time statistics
        const statsRes = await API.get("/stats");
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching dynamic stats:", err);
      }

      try {
        // Fetch real artist profiles from the database
        const profilesRes = await API.get("/profiles");
        const formattedArtists = profilesRes.data.map(p => ({
          name: p.stageName || p.user?.name || "Independent Artist",
          role: p.user?.role || "Musician",
          genres: p.genres && p.genres.length > 0 ? p.genres : ["Musician"],
          location: p.location || "Online",
          bio: p.bio || "TuneLink verified music creator.",
          isPlaying: false
        }));
        setArtists(formattedArtists.slice(0, 3));
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }

      try {
        // Fetch real projects from the database
        const projectsRes = await API.get("/projects");
        const formattedCollabs = projectsRes.data.map(p => ({
          title: p.title,
          creatorName: p.owner?.name || "Producer",
          rolesNeeded: p.requiredRoles && p.requiredRoles.length > 0 ? p.requiredRoles : ["Collaborator"],
          genres: p.genre ? [p.genre] : [],
          description: p.publicDescription,
          matchScore: 90 + Math.floor(Math.random() * 9), // calculate mock match
          datePosted: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently"
        }));
        setCollabs(formattedCollabs.slice(0, 2));
      } catch (err) {
        console.error("Error fetching projects:", err);
      }

      setIsLoading(false);
    };

    fetchRealData();
  }, []);

  return (
    <>
    <Navbar/>
      <section className="hero-section">
  {/* LEFT SIDE */}
  <div className="hero-content">
    
    <div className="badge badge-primary" style={{ marginBottom: "20px" }}>
      🎵 Music Collaboration Platform
    </div>

    <h1
      style={{
        fontSize: "4rem",
        lineHeight: "1.1",
        marginBottom: "25px",
        fontFamily: "var(--font-heading)"
      }}
    >
      Find artists.<br />
      Create music.<br />
      <span className="gradient-text">Build together.</span>
    </h1>

    <p
      className="hero-text"
      style={{
        fontSize: "1.15rem",
        color: "var(--text-muted)",
        lineHeight: "1.8",
        maxWidth: "600px",
        marginBottom: "40px"
      }}
    >
      Connect with singers, producers, lyricists and musicians from around the world.
      Discover talent and collaborate on your next masterpiece.
    </p>

    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      <Link to={isLoggedIn ? "/artists" : "/register"}>
        <button className="btn-primary" style={{ padding: "14px 28px" }}>
          Find Collaborators
        </button>
      </Link>

      <Link to={isLoggedIn ? "/profile" : "/register"}>
        <button className="btn-secondary" style={{ padding: "14px 28px" }}>
          Create Artist Profile
        </button>
      </Link>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="hero-work-cards">
    <div className="work-card">
      <div className="step-number">1</div>
      <h3>Create Profile</h3>
      <br></br>
      <p>Add your music role, genre, skills and artist details.</p>
    </div>

    <div className="work-card">
      <div className="step-number">2</div>
      <h3>Find Artists</h3>
      <br></br>
      <p>Explore singers, producers, lyricists and musicians.</p>
    </div>

    <div className="work-card">
      <div className="step-number">3</div>
      <h3>Send Request</h3>
      <br></br>
      <p>Connect with artists and start collaboration easily.</p>
    </div>

    <div className="work-card">
      <div className="step-number">4</div>
      <h3>Create Together</h3>
      <br></br>
      <p>Work on music projects and build something unique.</p>
    </div>
  </div>

</section>

      {/* Stats Section (Based on Real Data) */}
      <section style={{ maxWidth: "1200px", margin: "40px auto 80px", padding: "0 20px" }}>
        <div 
          className="glass-card" 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            textAlign: "center",
            padding: "40px 20px"
          }}
        >
          <div>
            <div style={{ fontSize: "2.8rem", fontWeight: "800", color: "var(--primary)", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
              {isLoading ? "..." : stats.totalArtists}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Verified Artists</div>
          </div>
          <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "2.8rem", fontWeight: "800", color: "var(--secondary)", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
              {isLoading ? "..." : stats.activeCollaborations}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Active Collaborations</div>
          </div>
          <div>
            <div style={{ fontSize: "2.8rem", fontWeight: "800", color: "var(--accent)", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
              {isLoading ? "..." : `${stats.algorithmFree}%`}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Algorithm-Free Matching</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section" id="features" style={{ maxWidth: "1200px", margin: "80px auto", padding: "0 20px" }}>
        <div className="section-header">
          <div className="badge badge-accent" style={{ marginBottom: "15px" }}>Professional Utility</div>
          <h2>Engineered for Artists</h2>
          <p>
            Forget likes and views. We provide actual utility tools designed to make remote song collaboration smooth, secure, and professional.
          </p>
        </div>

        <div className="grid-4">
          <div className="glass-card" style={{ textAlign: "left" }}>
            <div style={{ color: "var(--primary)", marginBottom: "20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>Artist Profiles</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Showcase audio snippets, list your exact studio gears, vocal ranges, DAW preferences, and genres.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: "left" }}>
            <div style={{ color: "var(--secondary)", marginBottom: "20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>Collab Board</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Post active song openings. Filter potential matches by roles, instruments, scales, and tempos.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: "left" }}>
            <div style={{ color: "var(--accent)", marginBottom: "20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>LyricShield™ 🛡️</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Protect your intellectual property. Shared lyrics can only be decrypted and viewed with permission logs.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: "left" }}>
            <div style={{ color: "var(--primary)", marginBottom: "20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>AI Smart Match</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Let our algorithm analyze musical elements like tempo alignment and keys to suggest compatible partners.
            </p>
          </div>
        </div>
      </section>


      {/* Join the Movement CTA */}
      <section style={{ maxWidth: "1200px", margin: "80px auto 120px", padding: "0 20px" }}>
        <div 
          className="glass-card" 
          style={{ 
            background: "linear-gradient(135deg, var(--primary-glow) 0%, var(--secondary-glow) 100%)",
            textAlign: "center",
            padding: "80px 40px"
          }}
        >
          <h2 style={{ fontSize: "2.8rem", marginBottom: "20px", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>Ready to find your sound?</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 40px", lineHeight: "1.6" }}>
            Create your account today, construct your artistic profile in minutes, and start connecting with matching lyricists, singers, and producers.
          </p>
          <Link to={isLoggedIn ? "/profile" : "/register"}>
            <button className="btn-primary" style={{ padding: "16px 48px", fontSize: "1.05rem" }}>
              {isLoggedIn ? "Go to Profile" : "Join TuneLink Now"}
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer 
        style={{ 
          borderTop: "1px solid rgba(255,255,255,0.06)", 
          padding: "40px 20px", 
          background: "rgba(5,5,8,0.4)",
          position: "relative",
          zIndex: 1
        }}
      >
        <div 
          style={{ 
            maxWidth: "1200px", 
            margin: "0 auto", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px"
          }}
        >
          <Link to="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--secondary)" }}>
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span>TuneLink</span>
          </Link>
          <p style={{ fontSize: "0.88rem", color: "var(--text-dimmed)" }}>
            © {new Date().getFullYear()} TuneLink. Created for talented music creators. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="#features" className="nav-link" style={{ fontSize: "0.85rem" }}>Privacy</a>
            <a href="#about" className="nav-link" style={{ fontSize: "0.85rem" }}>Terms</a>
            <a href="#artists" className="nav-link" style={{ fontSize: "0.85rem" }}>Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;