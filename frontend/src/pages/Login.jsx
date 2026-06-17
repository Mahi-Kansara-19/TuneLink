import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Logged in successfully! Redirecting... 🎵");

      setTimeout(() => {
  if (res.data.user.isAdmin) {
    navigate("/admin");
  } else {
    navigate("/");
  }
}, 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
              <h2>Welcome back to <span className="gradient-text">TuneLink</span>.</h2>
              <p>
                Log in to check your active collaborations, review your AI compatibility matches, and securely manage your lyrics.
              </p>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-dimmed)", fontWeight: "600", letterSpacing: "0.5px" }}>
              TUNELINK UTILITY ENGINE V1.0
            </div>
          </div>

          {/* Right form submission column */}
          <div className="auth-form-side">
            <div className="auth-form-header">
              <h3>Artist Login 🎧</h3>
              <p>Welcome back! Please enter your studio credentials below.</p>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
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

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "15px", padding: "14px" }} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
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
              Don't have an account? <Link to="/register">Register Now</Link>
            </p>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
  <Link
    to="/forgot-password"
    style={{
      color: "var(--accent)",
      textDecoration: "none",
      fontSize: "0.9rem",
      fontWeight: "500",
      transition: "color 0.2s"
    }}
  >
    Forgot Password?
  </Link>
</div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Login;