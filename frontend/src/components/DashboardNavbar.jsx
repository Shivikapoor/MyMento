import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import ThemeToggle from "./ThemeToggle";

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
  const location = useLocation();
  const user = getUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`dashboard-navbar ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="dashboard-navbar-top">
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

        <button
          type="button"
          className={`dashboard-menu-toggle ${isMenuOpen ? "active" : ""}`}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="dashboard-mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        id="dashboard-mobile-menu"
        className={`dashboard-navbar-content ${isMenuOpen ? "open" : ""}`}
      >
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
          <ThemeToggle className="dashboard-theme-btn" />
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
      </div>
    </header>
  );
}

export default DashboardNavbar;
