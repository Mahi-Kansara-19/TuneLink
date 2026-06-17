import { useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  const fetchAdminData = async () => {
    try {
      const statsRes = await API.get("/admin/stats");
      const usersRes = await API.get("/admin/users");
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await API.delete(`/admin/users/${id}`);
    fetchAdminData();
  };

 useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user?.isAdmin) {
    navigate("/login");
    return;
  }

  fetchAdminData();
}, []);

  return (
    <div className="admin-command-page">
      <div className="admin-hero">
        <h1>TuneLink Admin</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-neon-card">
          <span>👥</span>
          <h2>{stats.users || 0}</h2>
          <p>Total Users</p>
        </div>

        <div className="admin-neon-card">
          <span>🎤</span>
          <h2>{stats.profiles || 0}</h2>
          <p>Artist Profiles</p>
        </div>

        <div className="admin-neon-card">
          <span>🎵</span>
          <h2>{stats.projects || 0}</h2>
          <p>Projects</p>
        </div>

        <div className="admin-neon-card">
          <span>🤝</span>
          <h2>{stats.requests || 0}</h2>
          <p>Requests</p>
        </div>
      </div>

      <div className="admin-main-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Recent Users</h2>
            <p>Registered TuneLink users</p>
          </div>

          <div className="admin-user-list">
            {users.slice(0, 6).map((user) => (
              <div className="admin-user-row" key={user._id}>
                <div className="admin-user-info">
                  <div className="admin-avatar">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="admin-user-actions">
                  {user.isAdmin ? (
                    <span className="admin-role">Admin</span>
                  ) : (
                    <button
                      className="admin-delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Platform Analytics</h2>
            <p>Quick system overview</p>
          </div>

          <div className="analytics-bars">
            <div>
              <span>Users</span>
              <div className="bar"><div style={{ width: "85%" }}></div></div>
            </div>

            <div>
              <span>Projects</span>
              <div className="bar"><div style={{ width: "60%" }}></div></div>
            </div>

            <div>
              <span>Requests</span>
              <div className="bar"><div style={{ width: "70%" }}></div></div>
            </div>

            <div>
              <span>Artists</span>
              <div className="bar"><div style={{ width: "75%" }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-main-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Quick Actions</h2>
            <p>Common admin controls</p>
          </div>

          <div className="quick-actions">
            <button>➕ Add Admin</button>
            <button>🚫 Ban User</button>
            <button>🗑 Delete Project</button>
            <button>📩 View Reports</button>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h2>Activity Feed</h2>
            <p>Latest platform events</p>
          </div>

          <div className="activity-feed">
            <p>🟢 New user joined TuneLink</p>
            <p>🎵 Artist profile created</p>
            <p>🤝 Collaboration request sent</p>
            <p>🛡 Admin dashboard accessed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;