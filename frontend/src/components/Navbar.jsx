import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // ✅ SIMPLE ROLE (can upgrade later)
  const role = localStorage.getItem("role") || "student";

  return (
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

        {/* ✅ SHOW ADMIN ONLY IF ADMIN */}
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

        {/* ✅ SHOW ROLE */}
        <span style={{ marginLeft: "10px", fontSize: "0.8rem" }}>
          {role === "admin" ? "👨‍💼 Admin" : "🎓 Student"}
        </span>
      </div>
    </nav>
  );
}