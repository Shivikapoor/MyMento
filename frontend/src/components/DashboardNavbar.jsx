import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

const clientLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/mood-tracker", label: "Mood Tracker" },
  { to: "/my-schedule", label: "My Schedule" },
  { to: "/my-dreams", label: "My Dreams" },
  { to: "/talk-space", label: "Talk Space" },
  { to: "/career-guide", label: "Career Guide" },
];

function DashboardNavbar() {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <header className="dashboard-navbar">
      <button
        type="button"
        className="dashboard-brand"
        onClick={() =>
          navigate(
            user?.role === "counsellor"
              ? "/counsellor-dashboard"
              : "/dashboard"
          )
        }
      >
        <img
          src="/images/Logo.png"
          alt="MyMento logo"
          className="dashboard-brand-logo"
        />
        <div>
          <strong>MyMento</strong>
          <span>Mental Health Dashboard</span>
        </div>
      </button>

      <nav className="dashboard-nav-links">
        {clientLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `dashboard-nav-link ${isActive ? "active" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="dashboard-nav-actions">
        <span className="dashboard-user-chip">{user?.name || "User"}</span>
        <button
          type="button"
          className="dashboard-logout-btn"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default DashboardNavbar;
