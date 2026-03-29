import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken, getUser, logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  if (token && user?.role !== "counsellor") {
    const links = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/mood-tracker", label: "Mood Tracker" },
      { to: "/my-schedule", label: "My Schedule" },
      { to: "/my-dreams", label: "My Dreams" },
      { to: "/talk-space", label: "Talk Space" },
      { to: "/career-guide", label: "Career Guide" },
    ];

    return (
      <nav className="navbar">
        <div className="logo brand-inline brand-nav">
          <img src="/images/Logo.png" alt="MyMento logo" className="brand-logo brand-logo-nav" />
          <span>MYMENTO</span>
        </div>

        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to}>{link.label}</NavLink>
            </li>
          ))}
        </ul>

        <button
          className="login-btn"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="logo brand-inline brand-nav">
        <img src="/images/Logo.png" alt="MyMento logo" className="brand-logo brand-logo-nav" />
        <span>MYMENTO</span>
      </div>

      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
    </nav>
  );
};

export default Navbar;
