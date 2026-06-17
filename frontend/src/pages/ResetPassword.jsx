import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid or expired reset link"
      );
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
          <h2>Reset Password</h2>

          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "10px",
              marginBottom: "25px",
            }}
          >
            Enter your new password.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>

              <input
                type="password"
                className="form-input"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                className="form-input"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
              }}
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
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
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;