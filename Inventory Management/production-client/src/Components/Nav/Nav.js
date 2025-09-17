import React from "react";
import "./nav.css";
import { NavLink } from "react-router-dom";

function Nav({ profilePic }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <img src={profilePic} alt="profile" className="sidebar-profile-pic" />
        <h3 className="sidebar-name">Yashodhi Kaushallya</h3>
        <p className="sidebar-role">Production Manager</p>
      </div>

      <ul className="dashboard-ul">
        <li className="dashboard-li">
          <NavLink
            to="/Dashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <h3>Dashboard</h3>
          </NavLink>
        </li>

        <li className="dashboard-li">
          <NavLink
            to="/ProductionStocksPage"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <h3>Requested Production Stocks</h3>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Nav;
