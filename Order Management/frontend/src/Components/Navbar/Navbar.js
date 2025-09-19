import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // reuse your same CSS

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">Ceylon Eco Foods</span>
        </Link>
      </div>
      
      <div className="navbar-links">
        {/* Home */}
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          <i className="fas fa-home"></i> 
          <span className="link-text">Home</span>
        </Link>

        {/* Sign-Up */}
        <Link 
          to="/regi" 
          className={`btn btn-success ${isActive('/regi') ? 'active' : ''}`}
          style={{ marginLeft: '10px' }}
        >
          Sign Up
        </Link>

        {/* Login */}
        <Link 
          to="/log" 
          className={`btn btn-success ${isActive('/log') ? 'active' : ''}`}
          style={{ marginLeft: '10px' }}
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
