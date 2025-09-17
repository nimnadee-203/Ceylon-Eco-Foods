import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [targets, setTargets] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("employeeLoggedIn");
    if (!loggedIn) {
      navigate("/employee-login");
      return;
    }

    const empData = localStorage.getItem("employee");
    if (empData) {
      setEmployee(JSON.parse(empData));
    }
  }, [navigate]);

  useEffect(() => {
    if (!employee) return;

    const fetchData = async () => {
      try {
        const email = employee.email;

        const targetRes = await axios.get(
          `http://localhost:5000/employee-dashboard-api/targets/${email}`
        );
        setTargets(targetRes.data.targets);

        const scheduleRes = await axios.get(
          `http://localhost:5000/employee-dashboard-api/schedules/${email}`
        );
        setSchedules(scheduleRes.data.schedules);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [employee]);

  const handleLogout = () => {
    localStorage.removeItem("employee");
    localStorage.removeItem("employeeLoggedIn");
    localStorage.removeItem("role");
    navigate("/employee-login");
  };

  if (!employee) return <p>Loading employee data...</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4">Employee Dashboard</h2>

      {/* Employee Info Card */}
      <div className="card shadow-sm mb-5 p-4 employee-card d-flex flex-row justify-content-between align-items-center">
        <div>
          <h4>Welcome, {employee.name}</h4>
          <p className="mb-1"><strong>Email:</strong> {employee.email}</p>
          <p className="mb-1"><strong>Phone:</strong> {employee.phone}</p>
          <p className="mb-1"><strong>Position:</strong> {employee.position}</p>
          <p className="mb-0"><strong>Department:</strong> {employee.department}</p>
        </div>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-4 modern-card">
            <h6 className="text-muted">Total Targets</h6>
            <h3>{targets.length}</h3>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-4 modern-card">
            <h6 className="text-muted">Completed Targets</h6>
            <h3>{targets.filter(t => t.status === "Completed").length}</h3>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-4 modern-card">
            <h6 className="text-muted">Pending / In Progress</h6>
            <h3>{targets.filter(t => t.status !== "Completed").length}</h3>
          </div>
        </div>
      </div>

      {/* Assigned Targets */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              Assigned Targets
            </div>
            <div className="card-body">
              {loading ? <p>Loading targets...</p> : null}
              {targets.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {targets.map((t) => (
                    <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{t.productName}</strong>
                        <div className="small text-muted">
                          Target: {t.targetQuantity} | Achieved: {t.achievedQuantity}
                        </div>
                      </div>
                      <span className={`badge ${t.status === "Completed" ? "bg-success" : t.status === "In Progress" ? "bg-warning text-dark" : "bg-secondary"} rounded-pill`}>
                        {t.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : !loading ? (
                <p className="text-muted">No targets assigned.</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Assigned Schedules */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-info text-white">
              Assigned Schedules
            </div>
            <div className="card-body">
              {loading ? <p>Loading schedules...</p> : null}
              {schedules.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {schedules.map((s) => (
                    <li key={s._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{s.task}</strong>
                        <div className="small text-muted">{new Date(s.date).toLocaleDateString()}</div>
                      </div>
                      <span className="badge bg-secondary rounded-pill">Pending</span>
                    </li>
                  ))}
                </ul>
              ) : !loading ? (
                <p className="text-muted">No schedules assigned.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
