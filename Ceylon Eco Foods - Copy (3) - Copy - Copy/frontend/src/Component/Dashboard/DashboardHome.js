import React, { useState, useEffect } from "react";
import axios from "axios";

function DashboardHome() {
  const [summary, setSummary] = useState({
    employeeCount: 0,
    targetCount: 0,
    scheduleCount: 0
  });

  const [targets, setTargets] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/dashboard/summary")
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:5000/daily-targets")
      .then(res => setTargets(res.data.targets || []))
      .catch(err => console.error(err));

    axios.get("http://localhost:5000/schedules")
      .then(res => {
        const schedules = res.data.schedules || [];
        const today = new Date().toISOString().slice(0, 10);
        const todays = schedules.filter(s => {
          const d = s?.date ? new Date(s.date) : null;
          return d && d.toISOString().slice(0, 10) === today;
        });
        setTodaySchedules(todays);
      })
      .catch(err => console.error(err));
  }, []);

  const completed = targets.filter(t => (t.status || "Pending").toLowerCase() === "completed").length;
  const pending = targets.filter(t => (t.status || "Pending").toLowerCase() === "pending").length;
  const inProgress = targets.filter(t => {
    const status = (t.status || "Pending").toLowerCase();
    return status !== "completed" && status !== "pending";
  }).length;

  return (
    <div className="container my-4">
      <h1 className="mb-4">Dashboard</h1>

      {/* Top summary row */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm bg-primary bg-opacity-25">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Employees</h5>
              <p className="card-text display-6">{summary.employeeCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm bg-success bg-opacity-25">
            <div className="card-body">
              <h5 className="card-title text-success">Total Targets</h5>
              <p className="card-text display-6">{summary.targetCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm bg-info bg-opacity-25">
            <div className="card-body">
              <h5 className="card-title text-info">Total Schedules</h5>
              <p className="card-text display-6">{summary.scheduleCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle row – Targets status summary */}
      <div className="card shadow-sm mb-4 bg-light">
        <div className="card-body d-flex justify-content-around">
          <div className="text-center text-success">
            <h6>Completed</h6>
            <p className="h4">{completed}</p>
          </div>
          <div className="text-center text-danger">
            <h6>Pending</h6>
            <p className="h4">{pending}</p>
          </div>
          <div className="text-center text-warning">
            <h6>In Progress</h6>
            <p className="h4">{inProgress}</p>
          </div>
        </div>
      </div>

      {/* Today's schedules */}
      <div>
        <h2 className="mb-3">Today's Schedules</h2>
        {todaySchedules.length === 0 ? (
          <p>No schedules today</p>
        ) : (
          todaySchedules.map(s => (
            <div key={s._id} className="card mb-2 shadow-sm bg-light">
              <div className="card-body">
                <p className="mb-1">
                  <strong>Shift:</strong> {s.shiftType} ({s.startTime} - {s.endTime})
                </p>
                <p className="mb-0">
                  <strong>Number of Employees Assigned:</strong>{" "}
                  {Array.isArray(s.employee) ? s.employee.length : 0}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardHome;
