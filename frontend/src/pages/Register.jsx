import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Register() {
  const navigate = useNavigate();
const roleOptions = [
  "Singer",
  "Lyricist",
  "Producer",
  "Composer",
  "Rapper",
  "Mix Engineer",
];

const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  roles: [],
  instruments: [],
  genre: "Music",
});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleRoleChange = (role) => {
  setFormData((prev) => ({
    ...prev,
    roles: prev.roles.includes(role)
      ? prev.roles.filter((r) => r !== role)
      : [...prev.roles, role],
  }));
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
  "Djembe",
];

const handleInstrumentChange = (instrument) => {
  setFormData((prev) => ({
    ...prev,
    instruments: prev.instruments.includes(instrument)
      ? prev.instruments.filter((i) => i !== instrument)
      : [...prev.instruments, instrument],
  }));
};
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/register", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Account created successfully! Redirecting... 🎵");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Decorative background orbs */}
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      {/* Mini header linking back to home */}
      <div style={{ padding: "24px 5%", display: "flex", justifyContent: "flex-start", position: "relative", zIndex: 5 }}>
        <Link to="/" className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--secondary)" }}>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span>TuneLink</span>
        </Link>
      </div>

      <div className="auth-page">
        <div className="auth-split-container">
          {/* Left branding visual column */}
          <div className="auth-brand-side">
            <div className="auth-brand-content">
              <div className="vinyl-record-visual">
                <div className="vinyl-center-dot"></div>
              </div>
              <h2>Where beats find <span className="gradient-text">voices</span>.</h2>
              <p>
                Join a community of 1,200+ independent singers, beatmakers, lyricists, and producers. Show off your talent, not your follower count.
              </p>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-dimmed)", fontWeight: "600", letterSpacing: "0.5px" }}>
              TUNELINK UTILITY ENGINE V1.0
            </div>
          </div>

          {/* Right form submission column */}
          <div className="auth-form-side">
            <div className="auth-form-header">
              <h3>Join TuneLink 🎤</h3>
              <p>Create your artist profile to find your sound people.</p>
            </div>

            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Artist / Stage Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Kid Rhythm"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@studio.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
  <label>Instruments Played</label>

  <div className="role-checkbox-grid">
    {instrumentOptions.map((instrument) => (
      <label className="role-checkbox" key={instrument}>
        <input
          type="checkbox"
          checked={formData.instruments.includes(instrument)}
          onChange={() => handleInstrumentChange(instrument)}
        />
        <span>{instrument}</span>
      </label>
    ))}
  </div>
</div>

              <div className="form-group">
  <label>Select Your Roles</label>

  <div className="role-checkbox-grid">
  {roleOptions.map((role) => (
  <label key={role} className="role-checkbox">
    <input
      type="checkbox"
      checked={formData.roles.includes(role)}
      onChange={() => handleRoleChange(role)}
    />
    <span>{role}</span>
  </label>
))}
  </div>
</div>
<div className="form-group">
  <label>Primary Genre</label>
  <select
    name="genre"
    value={formData.genre}
    onChange={handleChange}
    className="form-select"
  >
    <option value="Indie Pop">Indie Pop</option>
    <option value="Pop">Pop</option>
    <option value="Bollywood">Bollywood</option>
    <option value="Acoustic">Acoustic</option>
    <option value="R&B">R&B</option>
    <option value="Hip Hop">Hip Hop</option>
    <option value="Lo-Fi">Lo-Fi</option>
    <option value="Rock">Rock</option>
    <option value="Classical">Classical</option>
    <option value="Folk">Folk</option>
  </select>
</div>
              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "15px", padding: "14px" }} disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Artist Profile"}
              </button>
            </form>

            {message && (
              <div 
                className="form-message" 
                style={{ 
                  marginTop: "20px", 
                  padding: "14px", 
                  borderRadius: "10px", 
                  background: message.includes("successfully") ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 0, 127, 0.12)",
                  border: message.includes("successfully") ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(255, 0, 127, 0.25)",
                  color: message.includes("successfully") ? "var(--success)" : "var(--secondary)",
                  textAlign: "center",
                  fontSize: "0.9rem",
                  fontWeight: "600"
                }}
              >
                {message}
              </div>
            )}

            

            <p className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;