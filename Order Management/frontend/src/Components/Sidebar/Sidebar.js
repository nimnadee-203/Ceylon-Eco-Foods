import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaClipboardList, 
  FaBoxOpen, 
  FaFileInvoiceDollar, 
  FaGift, 
  
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="admin-sidebar">
      <ul className="nav flex-column">

        <li className="nav-item">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <FaTachometerAlt className="sidebar-icon" /> Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <FaClipboardList className="sidebar-icon" /> Orders
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <FaBoxOpen className="sidebar-icon" /> Products
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/invoice"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <FaFileInvoiceDollar className="sidebar-icon" /> Invoice
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/loyalty"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            <FaGift className="sidebar-icon" /> Loyalty
          </NavLink>
        </li>

             </ul>
    </div>
  );
}

export default Sidebar;
