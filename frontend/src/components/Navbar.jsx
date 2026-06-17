import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar-wrapper">
      <div className="nav-container">
        <Link to="/" className="logo">
  <img
    src={logo}
    alt="TuneLink"
    style={{
      height: "42px",
      width: "42px",
      objectFit: "contain"
    }}
  />

  <span>TuneLink</span>
</Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          <Link to="/" className="nav-link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </Link>
          {!isLoggedIn ? (
            <>
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#artists" className="nav-link">
                Artists
              </a>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register">
                <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.88rem" }}>
                  Join Now
                </button>
              </Link>
            </>
          ) : (
            <>
            
              <Link to="/artists" className="nav-link">
                Explore Artists
              </Link>
               <Link to="/collab-board" className="nav-link">
                Open Projects 
              </Link>
              <Link to="/ai-match" className="nav-link">
                AI Match 🤖
              </Link>
              <Link  style={{
          width: "50px",
          height: "30px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1 rem",
          fontWeight: "800",
          color: "white",
          flexShrink: 0
        }} to="/profile" className="nav-link">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn-secondary" 
                style={{ padding: "8px 18px", fontSize: "0.85rem", borderRadius: "20px" }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger toggle button */}
        <button
          className="btn-secondary mobile-toggle-btn"
          style={{ display: "none", padding: "8px 12px", borderRadius: "10px" }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      {/* CSS style rule injected inline for mobile responsive toggle logic */}
      <style>{`
        @media (max-width: 768px) {
          .nav-menu {
            display: ${mobileMenuOpen ? "flex" : "none"};
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 15, 0.98);
            backdrop-filter: blur(25px);
            padding: 25px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            gap: 18px;
            align-items: stretch;
            text-align: center;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
