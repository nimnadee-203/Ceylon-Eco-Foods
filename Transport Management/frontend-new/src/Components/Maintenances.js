import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaWrench,
  FaDownload,
  FaSearch,
  FaCalendarAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTools,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaMoneyBill,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct import

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    type: "Repair",
    description: "",
    cost: "",
    status: "Scheduled",
    scheduledDate: "",
    completedDate: "",
    driverID: "",
  });
  const [editingId, setEditingId] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchRecords();
    fetchDrivers();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/maintenances");
      setRecords(res.data.maintenance || res.data || []);
    } catch (err) {
      console.error("Error fetching maintenance records:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/drivers");
      setDrivers(res.data.drivers || res.data || []);
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({
      vehicleNumber: "",
      type: "Repair",
      description: "",
      cost: "",
      status: "Scheduled",
      scheduledDate: "",
      completedDate: "",
      driverID: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...formData };
      if (payload.status === "Completed") {
        payload.confirmed = true;
      }

      if (editingId) {
        await axios.put(
          `http://localhost:5000/maintenances/${editingId}`,
          payload
        );
        showToastMessage("Maintenance record updated ✅");
      } else {
        await axios.post("http://localhost:5000/maintenances", payload);
        showToastMessage("Maintenance record added 🛠️");
      }
      await fetchRecords();
      resetForm();
    } catch (err) {
      console.error("Error saving maintenance:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      vehicleNumber: item.vehicleNumber || "",
      type: item.type || "Repair",
      description: item.description || "",
      cost: item.cost || "",
      status: item.status || "Scheduled",
      scheduledDate: item.scheduledDate?.split?.("T")[0] || "",
      completedDate: item.completedDate?.split?.("T")[0] || "",
      driverID: item.driver?._id || item.driver || "",
    });
    setEditingId(item._id);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/maintenances/${deleteId}`);
      await fetchRecords();
      showToastMessage("Record deleted 🗑️");
    } catch (err) {
      console.error("Error deleting maintenance:", err);
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  // ✅ PDF Download function (includes generatedAt so no unused-var warning)
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Company name & address
    const companyName = "Ceylon Eco Foods";
    const companyAddress = "No 123, Industrial Estate, Colombo, Sri Lanka";

    const generatedAt = new Date().toLocaleString(); // <--- now used below

    // Header
    doc.setFontSize(16);
    doc.text(companyName, 14, 15);
    doc.setFontSize(11);
    doc.text(companyAddress, 14, 22);

    // Title and generation timestamp
    doc.setFontSize(14);
    doc.text("Maintenance Report", 14, 35);
    doc.setFontSize(9);
    doc.text(`Generated: ${generatedAt}`, 14, 41);

    // Table with safe values
    autoTable(doc, {
      startY: 48,
      head: [
        [
          "Vehicle",
          "Type",
          "Description",
          "Cost",
          "Status",
          "Scheduled",
          "Completed",
          "Confirmed",
        ],
      ],
      body: (Array.isArray(records) ? records : []).map((r) => [
        r.vehicleNumber || "-",
        r.type || "-",
        r.description || "-",
        r.cost !== undefined && r.cost !== null ? `${r.cost}` : "-",
        r.status || "-",
        r.scheduledDate
          ? new Date(r.scheduledDate).toLocaleDateString()
          : "-",
        r.completedDate ? new Date(r.completedDate).toLocaleDateString() : "-",
        r.confirmed ? "Yes" : "No",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
    });

    // Add page numbers bottom-right
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.text(`Page ${i} / ${pageCount}`, pageWidth - 14, pageHeight - 8, {
        align: "right",
      });
    }

    const fileName = `maintenance_report_${Date.now()}.pdf`;
    doc.save(fileName);
    showToastMessage("✅ PDF exported");
  };

  const getStatusBadge = (status, confirmed) => {
    const map = {
      Scheduled: { class: "secondary", icon: FaClipboardList },
      "In Progress": { class: "warning", icon: FaHourglassHalf },
      Completed: { class: "success", icon: FaCheckCircle },
    };
    const statusInfo = map[status] || map.Scheduled;
    const Icon = statusInfo.icon;

    return (
      <div className="d-flex flex-column">
        <span
          className={`badge bg-${statusInfo.class} d-flex align-items-center gap-1`}
        >
          <Icon /> {status}
        </span>
        {confirmed ? (
          <span className="badge bg-success mt-1">Driver Confirmed ✅</span>
        ) : (
          <span className="badge bg-warning mt-1">Waiting for Driver...</span>
        )}
      </div>
    );
  };

  const filteredRecords = (records || []).filter((r) => {
    const search = (searchTerm || "").toLowerCase();
    return (
      (statusFilter === "All Status" || r.status === statusFilter) &&
      ((r.vehicleNumber || "").toLowerCase().includes(search) ||
        (r.type || "").toLowerCase().includes(search) ||
        (r.description || "").toLowerCase().includes(search))
    );
  });

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div>
      {/* Header */}
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Maintenance Management</h1>
          <p className="page-subtitle">Track and manage maintenance records</p>
        </div>
        <button className="btn btn-success" onClick={downloadPDF}>
          <FaDownload className="me-2" /> Download PDF
        </button>
      </div>

      {/* Form */}
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number"
            className="form-control"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <select
            name="type"
            className="form-select"
            value={formData.type}
            onChange={handleChange}
          >
            <option>Repair</option>
            <option>Service</option>
            <option>Inspection</option>
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            name="cost"
            placeholder="Cost"
            className="form-control"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            name="scheduledDate"
            className="form-control"
            value={formData.scheduledDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            name="completedDate"
            className="form-control"
            value={formData.completedDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <select
            name="driverID"
            className="form-select"
            value={formData.driverID}
            onChange={handleChange}
            required
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.email})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="col-md-12 text-end">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Record" : "Add Record"}
          </button>
        </div>
      </form>

      {/* Search + Filter */}
      <div className="search-filter-bar d-flex justify-content-between mb-3">
        <div className="position-relative flex-grow-1 me-3">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search maintenance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Scheduled</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Grid */}
      <div className="row">
        {filteredRecords.map((item) => (
          <div key={item._id} className="col-lg-4 col-md-6 mb-4">
            <div className="dashboard-card p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  <FaWrench className="text-danger me-2" />
                  <span className="fw-bold">{item.vehicleNumber}</span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => confirmDelete(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaTools className="me-2 text-muted" /> {item.type}
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaClipboardList className="me-2 text-muted" /> {item.description}
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaMoneyBill className="me-2 text-muted" /> ${item.cost}
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-muted" />{" "}
                {item.scheduledDate
                  ? new Date(item.scheduledDate).toLocaleDateString()
                  : "-"}
              </div>
              {item.completedDate && (
                <div className="mb-2 d-flex align-items-center">
                  <FaCheckCircle className="me-2 text-muted" />{" "}
                  {new Date(item.completedDate).toLocaleDateString()}
                </div>
              )}
              <div className="d-flex align-items-center justify-content-between">
                {getStatusBadge(item.status, item.confirmed)}
                {!item.confirmed && item.status !== "Completed" && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={async () => {
                      try {
                        await axios.get(
                          `http://localhost:5000/maintenances/confirm/${item._id}`
                        );
                        await fetchRecords();
                        showToastMessage("Driver confirmed ✅");
                      } catch (err) {
                        console.error("Confirm error:", err);
                      }
                    }}
                  >
                    Mark Confirmed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this record?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div
          className="toast show position-fixed top-0 end-0 m-3 bg-success text-white"
          style={{ zIndex: 9999 }}
        >
          <div className="toast-body">{toastMessage}</div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
