import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTruck,
  FaDownload,
  FaSearch,
  FaExclamationTriangle,
  FaGasPump,
  FaCheckCircle,
  FaWrench,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ import autoTable directly

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [formData, setFormData] = useState({
    vehicleType: "",
    licensePlate: "",
    fuelType: "",
    capacityValue: "",
    capacityUnit: "",
    status: "Active",
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Toast states
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // ✅ Delete confirm modal states
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/vehicles");
      setVehicles(response.data.vehicles || response.data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
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
        await axios.put(`http://localhost:5000/vehicles/${editingId}`, formData);
        showToastMessage("Vehicle updated successfully ✅");
      } else {
        await axios.post("http://localhost:5000/vehicles", formData);
        showToastMessage("Vehicle added successfully 🚗");
      }
      await fetchVehicles();
      resetForm();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleType: "",
      licensePlate: "",
      fuelType: "",
      capacityValue: "",
      capacityUnit: "",
      status: "Active",
    });
    setEditingId(null);
  };

  const handleEdit = (vehicle) => {
    setFormData({
      vehicleType: vehicle.vehicleType || "",
      licensePlate: vehicle.licensePlate || "",
      fuelType: vehicle.fuelType || "",
      capacityValue: vehicle.capacityValue || "",
      capacityUnit: vehicle.capacityUnit || "",
      status: vehicle.status || "Active",
    });
    setEditingId(vehicle._id);
  };

  // ✅ Confirm delete modal trigger
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // ✅ Final delete action
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/vehicles/${deleteId}`);
      await fetchVehicles();
      showToastMessage("Vehicle deleted successfully 🗑️");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  // ✅ PDF download (uses autoTable(doc, ...))
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Company header info
    const companyName = "Ceylon Eco Foods";
    const companyAddress = "No 123, Industrial Estate, Colombo, Sri Lanka";
    const generatedAt = new Date().toLocaleString(); // used in header

    doc.setFontSize(16);
    doc.text(companyName, 14, 15);
    doc.setFontSize(11);
    doc.text(companyAddress, 14, 22);

    doc.setFontSize(14);
    doc.text("Vehicle Report", 14, 34);
    doc.setFontSize(9);
    doc.text(`Generated: ${generatedAt}`, 14, 40);

    // Build table data safely
    const head = [["Type", "Plate", "Fuel", "Capacity", "Status"]];
    const body = (Array.isArray(vehicles) ? vehicles : []).map((v) => [
      v.vehicleType || "-",
      v.licensePlate || "-",
      v.fuelType || "-",
      (v.capacityValue !== undefined && v.capacityValue !== null)
        ? `${v.capacityValue} ${v.capacityUnit || ""}`.trim()
        : "-",
      v.status || "-",
    ]);

    // call autoTable correctly
    autoTable(doc, {
      startY: 48,
      head,
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
    });

    // add page numbers bottom-right
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

    const fileName = `ceylon_eco_foods_vehicles_${Date.now()}.pdf`;
    doc.save(fileName);
    showToastMessage("✅ PDF exported");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Active: { class: "success", text: "Active", icon: FaCheckCircle },
      Maintenance: { class: "warning", text: "Maintenance", icon: FaWrench },
      Inactive: { class: "secondary", text: "Inactive", icon: FaExclamationTriangle },
    };
    const statusInfo = statusMap[status] || statusMap.Active;
    const Icon = statusInfo.icon;
    return (
      <span className={`badge bg-${statusInfo.class} d-flex align-items-center gap-1`}>
        <Icon /> {statusInfo.text}
      </span>
    );
  };

  const filteredVehicles = (Array.isArray(vehicles) ? vehicles : []).filter(
    (vehicle) =>
      (statusFilter === "All Status" || vehicle.status === statusFilter) &&
      (
        (vehicle.licensePlate || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        (vehicle.vehicleType || "").toLowerCase().includes((searchTerm || "").toLowerCase())
      )
  );

  // ✅ Toast function
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
          <h1 className="page-title">Vehicle Management</h1>
          <p className="page-subtitle">
            Manage your fleet vehicles and maintenance schedules
          </p>
        </div>
        <button className="btn btn-success" onClick={downloadPDF}>
          <FaDownload className="me-2" />
          Download PDF
        </button>
      </div>

      {/* Form */}
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            name="vehicleType"
            placeholder="Type"
            value={formData.vehicleType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            name="licensePlate"
            placeholder="License Plate"
            value={formData.licensePlate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
          >
            <option value="">Fuel Type</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            name="capacityValue"
            placeholder="Capacity"
            value={formData.capacityValue}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="capacityUnit"
            value={formData.capacityUnit}
            onChange={handleChange}
            required
          >
            <option value="">Unit</option>
            <option>Kg</option>
            <option>Ton</option>
            <option>Litre</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Maintenance</option>
          </select>
        </div>
        <div className="col-md-12 text-end">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Vehicle" : "Add Vehicle"}
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
            placeholder="Search vehicles..."
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
          <option>Maintenance</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Vehicles Grid */}
      <div className="row">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle._id || vehicle.licensePlate} className="col-lg-4 col-md-6 mb-4">
            <div className="dashboard-card p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  <FaTruck className="text-primary me-2" />
                  <span className="fw-bold">{vehicle.licensePlate}</span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => confirmDelete(vehicle._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <small className="text-muted">Type</small>
                <div>{vehicle.vehicleType}</div>
              </div>
              <div className="mb-2">
                <small className="text-muted">Capacity</small>
                <div>
                  {vehicle.capacityValue} {vehicle.capacityUnit}
                </div>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FaGasPump className="me-1 text-muted" />
                <div>{vehicle.fuelType}</div>
              </div>
              <div>{getStatusBadge(vehicle.status)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Bootstrap Modal */}
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
                <p>Are you sure you want to delete this vehicle?</p>
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

      {/* ✅ Toast Notification */}
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

export default Vehicles;
