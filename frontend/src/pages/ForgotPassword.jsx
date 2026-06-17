import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await API.post("/auth/forgot-password", {
        email,
      });

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <main
        style={{
          maxWidth: "500px",
          margin: "100px auto",
          width: "100%",
        }}
      >
        <div className="glass-card">
          <h2>Forgot Password</h2>

          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "10px",
              marginBottom: "25px",
            }}
          >
            Enter your registered email and we'll send a reset link.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                className="form-input"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {message && (
            <div className="form-message success">
              {message}
            </div>
          )}

          {error && (
            <div className="form-message error">
              {error}
            </div>
          )}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;