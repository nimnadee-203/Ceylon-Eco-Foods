import React from "react";
import { Link } from "react-router-dom";

function ScheduleHome() {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h1 className="card-title mb-3">Schedule Dashboard</h1>
        <p className="card-text">Manage schedules from here</p>
        <div className="mt-4">
          <Link to="/addschedule" className="btn btn-primary me-2">
            Add Schedule
          </Link>
          <Link to="/scheduledetails" className="btn btn-secondary">
            View Schedule List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ScheduleHome;
