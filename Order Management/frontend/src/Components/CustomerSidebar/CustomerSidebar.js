// CustomerSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaBoxOpen, FaClipboardList } from "react-icons/fa";
import "./CustomerSidebar.css";

function CustomerSidebar() {
  return (
    <div className="customer-sidebar">
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            to="/customer-dashboard"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <FaBoxOpen className="sidebar-icon" /> Buy Products
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <FaShoppingCart className="sidebar-icon" /> My Cart
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/my-orders"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <FaClipboardList className="sidebar-icon" /> My Orders
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default CustomerSidebar;
