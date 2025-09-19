import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function CustomerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const customerLoggedIn = localStorage.getItem("customerLoggedIn") === "true";
  const customer = customerLoggedIn ? JSON.parse(localStorage.getItem("customer") || "{}") : null;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("customerLoggedIn");
    localStorage.removeItem("customer");
    localStorage.removeItem("role");
    localStorage.removeItem("cart"); // Clear cart on logout
    window.dispatchEvent(new Event("loginStatusChange"));
    navigate("/log");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">Ceylon Eco Foods</span>
        </Link>
      </div>
      
      <div className="navbar-links">
        {!customerLoggedIn ? (
          <>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/regi" 
              className="btn btn-success"
              style={{ marginLeft: '10px' }}
            >
              Sign-Up
            </Link>
            <Link 
              to="/log" 
              className="btn btn-success"
              style={{ marginLeft: '10px' }}
            >
              Login
            </Link>
          </>
        ) : (
          <div className="user-profile">
            <Link to="/profile" className="profile-info" style={{ textDecoration: 'none' }}>
              <i className="bi bi-person-circle profile-icon"></i>
              <span className="user-name">{customer?.fullName || 'Customer'}</span>
            </Link>
            <button className="btn btn-outline-light logout-btn" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default CustomerNavbar;
