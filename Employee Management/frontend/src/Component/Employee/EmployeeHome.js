import React from "react";
import { Link } from "react-router-dom";

function EmployeeHome() {
  return (
    <div>
      <h1>Employee Dashboard</h1>
      <p>Manage employees from here</p>
      <div className="mt-3">
        <Link to="/addemployee" className="btn btn-success me-2">Add Employee</Link>
        <Link to="/employeedetails" className="btn btn-primary">View Employee List</Link>
      </div>
    </div>
  );
}

export default EmployeeHome;
