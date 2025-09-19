import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function AdminNavbar() {
  const navigate = useNavigate();
  const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  const admin = adminLoggedIn ? JSON.parse(localStorage.getItem("admin") || "{}") : null;

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("loginStatusChange"));
    navigate("/AdminLogin");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🌱 Ceylon Eco Foods</Link>
      </div>
      <div className="navbar-links">
        {!adminLoggedIn ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/AdminLogin" className="btn btn-primary">Login</Link>
            <Link to="/AdminSignUp" className="btn btn-success">Sign-Up</Link>
          </>
        ) : (
          <div className="user-profile">
            <div className="profile-info">
              <i className="bi bi-person-circle profile-icon"></i>
              <span className="user-name">{admin?.fullName || 'Admin'}</span>
            </div>
            <button className="btn btn-outline-light logout-btn" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AdminNavbar;
