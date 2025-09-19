import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserTie,
  FaDownload,
  FaSearch,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBill,
  FaCheckCircle,
  FaBan,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ import autotable

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    address: "",
    email: "",
    status: "Active",
    hireDate: "",
    salary: "",
  });
  const [editingId, setEditingId] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/drivers");
      setDrivers(response.data.drivers || response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/drivers/${editingId}`, formData);
        showToastMessage("Driver updated successfully ✅");
      } else {
        await axios.post("http://localhost:5000/drivers", formData);
        showToastMessage("Driver added successfully 👨‍✈️");
      }
      fetchDrivers();
      resetForm();
    } catch (error) {
      console.error("Error saving driver:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      licenseNumber: "",
      phone: "",
      address: "",
      email: "",
      status: "Active",
      hireDate: "",
      salary: "",
    });
    setEditingId(null);
  };

  const handleEdit = (driver) => {
    setFormData({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      phone: driver.phone,
      address: driver.address,
      email: driver.email || "",
      status: driver.status,
      hireDate: driver.hireDate?.split("T")[0] || "",
      salary: driver.salary,
    });
    setEditingId(driver._id);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/drivers/${deleteId}`);
      fetchDrivers();
      showToastMessage("Driver deleted successfully 🗑️");
    } catch (error) {
      console.error("Error deleting driver:", error);
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  // ✅ Fixed PDF function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(18);
    doc.text("Ceylon Eco Foods", 14, 20);

    doc.setFontSize(10);
    doc.text("No. 123, Main Street, Colombo, Sri Lanka", 14, 28);

    // Report Title
    doc.setFontSize(14);
    doc.text("Driver Report", 14, 40);

    // Table
    autoTable(doc, {
      startY: 48,
      head: [["Name", "License", "Phone", "Email", "Address", "Status", "Hire Date", "Salary"]],
      body: drivers.map((d) => [
        d.name,
        d.licenseNumber,
        d.phone,
        d.email || "",
        d.address,
        d.status,
        new Date(d.hireDate).toLocaleDateString(),
        `$${d.salary}`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] }, // green header
    });

    // Footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save("drivers_report.pdf");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Active: { class: "success", text: "Active", icon: FaCheckCircle },
      Inactive: { class: "secondary", text: "Inactive", icon: FaBan },
      Suspended: { class: "warning", text: "Suspended", icon: FaExclamationTriangle },
    };
    const statusInfo = statusMap[status] || statusMap.Active;
    const Icon = statusInfo.icon;
    return (
      <span className={`badge bg-${statusInfo.class} d-flex align-items-center gap-1`}>
        <Icon /> {statusInfo.text}
      </span>
    );
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      (statusFilter === "All Status" || driver.status === statusFilter) &&
      (driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Driver Management</h1>
          <p className="page-subtitle">Manage your company drivers</p>
        </div>
        <button className="btn btn-success" onClick={downloadPDF}>
          <FaDownload className="me-2" />
          Download PDF
        </button>
      </div>

      {/* Form */}
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="licenseNumber"
            placeholder="License Number"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
        </div>
        <div className="col-md-12 text-end">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Driver" : "Add Driver"}
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
            placeholder="Search drivers..."
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
          <option>Active</option>
          <option>Inactive</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Driver Grid */}
      <div className="row">
        {filteredDrivers.map((driver) => (
          <div key={driver._id} className="col-lg-4 col-md-6 mb-4">
            <div className="dashboard-card p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  <FaUserTie className="text-primary me-2" />
                  <span className="fw-bold">{driver.name}</span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(driver)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => confirmDelete(driver._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <small className="text-muted">License</small>
                <div>{driver.licenseNumber}</div>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaPhone className="me-2 text-muted" /> {driver.phone}
              </div>
              <div className="mb-2 d-flex align-items-center">
                <small className="text-muted">Email</small>
                <div>{driver.email}</div>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-muted" /> {driver.address}
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaCalendarAlt className="me-2 text-muted" />{" "}
                {new Date(driver.hireDate).toLocaleDateString()}
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaMoneyBill className="me-2 text-muted" /> ${driver.salary}
              </div>
              <div>{getStatusBadge(driver.status)}</div>
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
                <p>Are you sure you want to delete this driver?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
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

export default Drivers;
