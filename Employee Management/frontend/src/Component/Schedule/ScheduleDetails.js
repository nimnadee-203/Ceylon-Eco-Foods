import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ScheduleDetails() {
  const [schedules, setSchedules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteSchedule, setDeleteSchedule] = useState(null); // Schedule to delete

  useEffect(() => {
    const fetchSchedules = async () => {
      const res = await axios.get("http://localhost:5000/schedules");
      setSchedules(res.data.schedules || res.data);
    };
    fetchSchedules();
  }, []);

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/schedules/${deleteSchedule._id}`);
      setSchedules(prev => prev.filter(s => s._id !== deleteSchedule._id));
      setDeleteSchedule(null); // Close modal
      alert("Schedule deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting schedule!");
    }
  };

  // 🔎 Filter schedules
  const filteredSchedules = schedules.filter((s) => {
    const empEmails = s.employee?.join(" ").toLowerCase() || "";
    return (
      empEmails.includes(searchQuery.toLowerCase()) ||
      (s.task?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.shiftType?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (new Date(s.date).toDateString().toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // 📄 Export PDF function
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Schedule Report", 14, 15);

    const tableData = filteredSchedules.map((s, index) => [
      index + 1,
      new Date(s.date).toDateString(),
      s.task || "N/A",
      `${s.startTime} - ${s.endTime}`,
      s.shiftType,
      s.employee && s.employee.length > 0 ? s.employee.join(", ") : "No employees assigned"
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["#", "Date", "Task", "Time", "Shift", "Employees"]],
      body: tableData,
    });

    doc.save("schedules.pdf");
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Schedule List</h1>

      {/* 🔍 Search bar + PDF download */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by employee email, task, shift or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-success ms-3" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      {filteredSchedules.map((s) => (
        <div key={s._id} className="card mb-3 shadow-sm border-primary">
          <div className="card-body">
            <p className="card-text">
              <strong>Task:</strong> {s.task || "N/A"}
            </p>
            <p className="card-text">
              <strong>Employees:</strong>{" "}
              {s.employee && s.employee.length > 0 ? (
                s.employee.map((email, index) => (
                  <span key={index} className="badge bg-success me-1">
                    {email}
                  </span>
                ))
              ) : (
                <span className="text-muted">No employees assigned</span>
              )}
            </p>
            <p className="card-text">
              <strong>Date:</strong> {new Date(s.date).toDateString()}
            </p>
            <p className="card-text">
              <strong>Shift:</strong> {s.startTime} - {s.endTime} ({s.shiftType})
            </p>
            <div className="d-flex gap-2">
              <Link
                className="btn btn-primary btn-sm"
                to={`/updateschedule/${s._id}`}
              >
                Update
              </Link>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setDeleteSchedule(s)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {filteredSchedules.length === 0 && (
        <p className="text-muted">No schedules found.</p>
      )}

      {/* Delete Confirmation Modal */}
      {deleteSchedule && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteSchedule(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the schedule for <b>{deleteSchedule.task}</b>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteSchedule(null)}>No</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleDetails;
