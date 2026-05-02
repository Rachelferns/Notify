import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username.trim());
      setRole(data.role);
      setShowModal(false);
      setUsername("");
      if (data.role === "admin") navigate("/admin");
    } catch {
      setError("Could not connect to auth service. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setRole("");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__brand">
          <div className="navbar__logo">N</div>
          <div>
            <div className="navbar__title">Notify</div>
            <div className="navbar__subtitle">SMART NOTICE BOARD</div>
          </div>
        </div>

        <div className="navbar__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "navbar__link" + (isActive ? " active" : "")
            }
          >
            Home
          </NavLink>

          {role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                "navbar__link" + (isActive ? " active" : "")
              }
            >
              Admin
              <span className="navbar__badge">Dashboard</span>
            </NavLink>
          )}
        </div>

        <div className="navbar__right">
          <span className="navbar__date">{today}</span>

          {role ? (
            <>
              <span className="navbar__role-pill">
                {role === "admin" ? "👨‍💼 Admin" : "🎓 Student"}
              </span>
              <button className="navbar__btn navbar__btn--ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="navbar__btn" onClick={() => setShowModal(true)}>
              Login
            </button>
          )}
        </div>
      </nav>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Login</h2>
            <p className="modal__hint">
              Use <strong>admin</strong> for admin access, any other name for student access.
            </p>
            <form onSubmit={handleLogin} className="modal__form">
              <input
                className="modal__input"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              {error && <p className="modal__error">{error}</p>}
              <div className="modal__actions">
                <button
                  type="button"
                  className="navbar__btn navbar__btn--ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="navbar__btn" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
