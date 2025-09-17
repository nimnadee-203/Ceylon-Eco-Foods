import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function EmployeeDetails() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null); // Employee to delete

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/employees");
        const data = res.data.employees || res.data;
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/employees/${deleteTarget._id}`);
      setEmployees(prev => prev.filter(emp => emp._id !== deleteTarget._id));
      setFilteredEmployees(prev => prev.filter(emp => emp._id !== deleteTarget._id));
      setDeleteTarget(null); // Close modal
      alert("Employee deleted successfully!"); // optional
    } catch (err) {
      console.error(err);
      alert("Error deleting employee!");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(emp => {
      if (searchField === "all") {
        return Object.values(emp).some(val =>
          val?.toString().toLowerCase().includes(query)
        );
      } else if (searchField === "id") {
        return emp._id.toLowerCase().includes(query);
      } else {
        return emp[searchField]?.toString().toLowerCase().includes(query);
      }
    });

    setFilteredEmployees(filtered);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee List", 14, 22);

    const tableColumn = ["ID", "Name", "Email", "Position", "Phone", "Password"];
    const tableRows = filteredEmployees.map(emp => [
      emp._id.slice(-6).toUpperCase(),
      emp.name || "",
      emp.email || "",
      emp.position || "",
      emp.phone || "",
      emp.password || "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("employees_report.pdf");
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center fw-bold">👨‍💼 Employee List</h1>

      {/* Search & Filter */}
      <div className="d-flex gap-2 mb-4 flex-wrap p-3 rounded shadow-sm"
           style={{ background: "#ffffff", border: "1px solid #e3e6ea" }}>
        <select className="form-select w-auto" value={searchField} onChange={e => setSearchField(e.target.value)}>
          <option value="all">All Fields</option>
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="position">Position</option>
          <option value="phone">Phone</option>
          <option value="password">Password</option>
        </select>

        <input type="text" className="form-control" placeholder="🔍 Search employees..."
               value={searchQuery} onChange={handleSearch} />

        {filteredEmployees.length > 0 && (
          <button className="btn btn-success fw-semibold" onClick={handleDownloadPDF}>
            📄 Download PDF
          </button>
        )}
      </div>

      {/* Employee Cards */}
      {filteredEmployees.length === 0 ? (
        <p className="text-muted text-center">No employees found.</p>
      ) : (
        <div className="row">
          {filteredEmployees.map(emp => (
            <div key={emp._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card border-0 shadow-lg h-100" style={{ borderRadius: "15px", transition: "transform 0.2s" }}
                   onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                   onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <div className="card-body" style={{ background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}>
                  <h5 className="card-title fw-bold text-primary mb-3">{emp.name}</h5>
                  <ul className="list-unstyled small mb-3">
                    <li><b>ID:</b> {emp._id}</li>
                    <li><b>Email:</b> {emp.email}</li>
                    <li><b>Position:</b> {emp.position}</li>
                    <li><b>Department:</b> {emp.department}</li>
                    <li><b>Phone:</b> {emp.phone}</li>
                    <li><b>Password:</b> {emp.password}</li>
                  </ul>

                  <div className="d-flex justify-content-between">
                    <a href={`/updateemployee/${emp._id}`} className="btn btn-outline-primary btn-sm px-3">✏️ Update</a>
                    <button className="btn btn-outline-danger btn-sm px-3"
                            onClick={() => setDeleteTarget(emp)}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <b>{deleteTarget.name}</b>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>No</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EmployeeDetails;
