import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Targetdetails() {
  const [targets, setTargets] = useState([]);
  const [filteredTargets, setFilteredTargets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null); // Target to delete
  const navigate = useNavigate();

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/daily-targets");
      const data = res.data.targets || res.data;
      setTargets(data);
      setFilteredTargets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/daily-targets/${deleteTarget._id}`);
      setTargets(prev => prev.filter(t => t._id !== deleteTarget._id));
      setFilteredTargets(prev => prev.filter(t => t._id !== deleteTarget._id));
      setDeleteTarget(null); // Close modal
      alert("Target deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting target!");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Targets Report", 14, 22);

    const tableColumn = ["ID", "Date", "Product", "Target Qty", "Achieved Qty", "Status", "Employee", "Remarks"];
    const tableRows = filteredTargets.map(t => [
      t._id.slice(-6).toUpperCase(),
      t.targetDate || "",
      t.productName || "",
      t.targetQuantity || "",
      t.achievedQuantity || "",
      t.status || "",
      Array.isArray(t.employee) ? t.employee.join(", ") : t.employee,
      t.remarks || "",
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("targets_report.pdf");
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredTargets(targets);
      return;
    }

    const filtered = targets.filter(t => {
      if (searchField === "all") {
        return Object.values(t).some(f => f?.toString().toLowerCase().includes(query));
      } else if (searchField === "id") {
        return t._id.toLowerCase().includes(query);
      } else if (searchField === "employee") {
        return Array.isArray(t.employee)
          ? t.employee.some(emp => emp.toLowerCase().includes(query))
          : t.employee?.toLowerCase().includes(query);
      } else {
        return t[searchField]?.toString().toLowerCase().includes(query);
      }
    });

    setFilteredTargets(filtered);
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container mt-5">
        <h1 className="mb-4 text-center">Target Details</h1>

        <div className="d-flex justify-content-center mb-4 gap-2">
          <button className="btn btn-primary" onClick={() => navigate("/addtarget")}>Add Target</button>
          {filteredTargets.length > 0 && <button className="btn btn-success" onClick={handleDownloadPDF}>Download PDF</button>}
        </div>

        <div className="d-flex justify-content-center mb-4 gap-2">
          <select className="form-select w-auto" value={searchField} onChange={e => setSearchField(e.target.value)}>
            <option value="all">All Fields</option>
            <option value="id">ID</option>
            <option value="productName">Product</option>
            <option value="status">Status</option>
            <option value="employee">Employee</option>
            <option value="remarks">Remarks</option>
          </select>
          <input type="text" className="form-control w-50" placeholder="Search..." value={searchQuery} onChange={handleSearch} />
        </div>

        <div className="row">
          {filteredTargets.length > 0 ? filteredTargets.map(t => (
            <div className="col-md-4 mb-4" key={t._id}>
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title text-primary">{t.productName}</h5>
                  <p><b>ID:</b> {t._id.slice(-6).toUpperCase()}</p>
                  <p><b>Date:</b> {t.targetDate}</p>
                  <p><b>Target Qty:</b> {t.targetQuantity}</p>
                  <p><b>Achieved Qty:</b> {t.achievedQuantity}</p>
                  <p><b>Status:</b> <span className={`badge ${t.status==="Completed"?"bg-success":t.status==="In Progress"?"bg-warning text-dark":"bg-secondary"}`}>{t.status}</span></p>
                  <p><b>Employee:</b> {Array.isArray(t.employee) ? t.employee.join(", ") : t.employee}</p>
                  <p><b>Remarks:</b> {t.remarks}</p>

                  <div className="d-flex gap-2">
                    <button className="btn text-white" style={{ backgroundColor: "#0b3d91" }} onClick={() => navigate(`/updatetarget/${t._id}`)}>Update</button>
                    <button className="btn btn-danger" onClick={() => setDeleteTarget(t)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )) : <p className="text-center">No targets found</p>}
        </div>

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
                  <p>Are you sure you want to delete <b>{deleteTarget.productName}</b>?</p>
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
    </div>
  );
}

export default Targetdetails;
