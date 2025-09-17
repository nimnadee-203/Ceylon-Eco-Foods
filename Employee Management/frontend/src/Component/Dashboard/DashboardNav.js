import React from "react";
import { NavLink } from "react-router-dom";

function DashboardNav() {
  return (
    <div className="p-3 bg-light" style={{ minHeight: "100vh" }}>
      <h3 className="mb-4 text-success">Dashboard</h3>

      {/* Dashboard Home link */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          "d-block mb-2 p-2 rounded fw-bold text-decoration-none " +
          (isActive ? "bg-success text-white" : "text-success")
        }
      >
        Dashboard Home
      </NavLink>

      {/* Employee */}
      <NavLink
        to="/employeehome"
        className={({ isActive }) =>
          "d-block mb-2 p-2 rounded fw-bold text-decoration-none " +
          (isActive ? "bg-success text-white" : "text-success")
        }
      >
        Employee
      </NavLink>

      {/* Target Details */}
      <NavLink
        to="/targetdetails"
        className={({ isActive }) =>
          "d-block mb-2 p-2 rounded fw-bold text-decoration-none " +
          (isActive ? "bg-success text-white" : "text-success")
        }
      >
        Target Details
      </NavLink>

      {/* Schedule */}
      <NavLink
        to="/schedulehome"
        className={({ isActive }) =>
          "d-block mb-2 p-2 rounded fw-bold text-decoration-none " +
          (isActive ? "bg-success text-white" : "text-success")
        }
      >
        Schedule
      </NavLink>
    </div>
  );
}

export default DashboardNav;
