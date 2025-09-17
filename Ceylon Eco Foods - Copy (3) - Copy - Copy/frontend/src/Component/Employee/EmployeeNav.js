import React from "react";
import { Link } from "react-router-dom";

function EmployeeNav() {
  return (
    <div className="sidebar">
      <h2 className="logo">Ceylon Eco Foods - Employees</h2>
      <ul className="sidebar-ul">
        <li><Link to="/home" className="sidebar-link">Dashboard</Link></li>
        <li><Link to="/employeedetails" className="sidebar-link">Employee List</Link></li>
        <li><Link to="/addemployee" className="sidebar-link">Add Employee</Link></li>
      </ul>
    </div>
  );
}

export default EmployeeNav;
