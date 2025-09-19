import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaDownload,
  FaPlus,
  FaSearch,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [formData, setFormData] = useState({
    routeName: "",
    startLocation: "",
    endLocation: "",
    totalDistance: "",
    estimatedTime: "",
    status: "Active",
  });
  const [editingRoute, setEditingRoute] = useState(null);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);

  // Toast message state
  const [toastMessage, setToastMessage] = useState("");

  const API_URL = "http://localhost:5000/routes";

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(API_URL);
      const routeData = Array.isArray(response.data)
        ? response.data
        : response.data.routes || [];
      setRoutes(routeData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setRoutes([]);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await axios.put(`${API_URL}/${editingRoute._id}`, formData);
        showToast("✅ Route updated successfully!");
      } else {
        await axios.post(API_URL, formData);
        showToast("✅ New route added successfully!");
      }

      await fetchRoutes();
      setFormData({
        routeName: "",
        startLocation: "",
        endLocation: "",
        totalDistance: "",
        estimatedTime: "",
        status: "Active",
      });
      setEditingRoute(null);
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000); // auto dismiss after 3s
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      routeName: route.routeName || "",
      startLocation: route.startLocation || "",
      endLocation: route.endLocation || "",
      totalDistance: route.totalDistance || "",
      estimatedTime: route.estimatedTime || "",
      status: route.status || "Active",
    });
  };

  const confirmDelete = (route) => {
    setRouteToDelete(route);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (routeToDelete) {
      try {
        await axios.delete(`${API_URL}/${routeToDelete._id}`);
        await fetchRoutes();
        showToast("✅ Route deleted successfully!");
      } catch (error) {
        console.error("Error deleting route:", error);
      } finally {
        setShowDeleteModal(false);
        setRouteToDelete(null);
      }
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    // Company header
    const companyName = "Ceylon Eco Foods";
    const companyAddressLine1 = "No. 123, Green Road";
    const companyAddressLine2 = "Colombo 07, Sri Lanka";
    const generatedAt = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text(companyName, 14, 14);
    doc.setFontSize(10);
    doc.text(companyAddressLine1, 14, 20);
    doc.text(companyAddressLine2, 14, 25);

    doc.setFontSize(12);
    doc.text("Route Report", 14, 36);
    doc.setFontSize(9);
    doc.text(`Generated: ${generatedAt}`, 14, 41);

    const tableColumn = [
      "Route ID",
      "Name",
      "Start",
      "End",
      "Distance",
      "Time",
      "Status",
    ];

    const tableRows = (Array.isArray(routes) ? routes : []).map((route) => [
      route.routeId || route._id || "",
      route.routeName || "",
      route.startLocation || "",
      route.endLocation || "",
      route.totalDistance !== undefined && route.totalDistance !== null
        ? `${route.totalDistance} km`
        : "",
      route.estimatedTime || "",
      route.status || "",
    ]);

    // call autoTable correctly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 48,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
    });

    // add page numbers on each page
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

    const fileName = `ceylon_eco_foods_routes_${Date.now()}.pdf`;
    doc.save(fileName);
    showToast("✅ PDF exported");
  };

  const filteredRoutes = Array.isArray(routes)
    ? routes.filter((route) => {
        const search = searchTerm.trim().toLowerCase();
        const matchesSearch =
          (route.routeName && route.routeName.toLowerCase().includes(search)) ||
          (route.routeId && route.routeId.toLowerCase().includes(search)) ||
          (route._id && route._id.toLowerCase().includes(search));

        const matchesStatus =
          statusFilter === "All Status" || route.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Route Management</h1>
          <p className="page-subtitle">Manage delivery routes from database</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-custom" onClick={exportPDF}>
            <FaDownload className="me-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="toast show position-fixed top-0 end-0 m-3 align-items-center text-bg-success border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 2000, minWidth: "250px" }}
        >
          <div className="d-flex">
            <div className="toast-body">
              <FaCheckCircle className="me-2" />
              {toastMessage}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToastMessage("")}
            ></button>
          </div>
        </div>
      )}

      {/* Form */}
      <form className="card p-3 mb-4" onSubmit={handleSubmit}>
        <h5>{editingRoute ? "Update Route" : "Add New Route"}</h5>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              name="routeName"
              value={formData.routeName}
              onChange={handleChange}
              className="form-control"
              placeholder="Route Name"
              required
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleChange}
              className="form-control"
              placeholder="Start Location"
              required
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              name="endLocation"
              value={formData.endLocation}
              onChange={handleChange}
              className="form-control"
              placeholder="End Location"
              required
            />
          </div>
          <div className="col-md-3 mb-2">
            <input
              type="number"
              name="totalDistance"
              value={formData.totalDistance}
              onChange={handleChange}
              className="form-control"
              placeholder="Distance (km)"
              required
            />
          </div>
          <div className="col-md-3 mb-2">
            <input
              type="text"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              className="form-control"
              placeholder="Estimated Time (e.g., 2h 30m)"
              required
            />
          </div>
          <div className="col-md-3 mb-2">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="col-md-3 mb-2 d-flex align-items-center">
            <button type="submit" className="btn btn-primary w-100">
              <FaPlus className="me-1" />
              {editingRoute ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      {/* Search + Filter */}
      <div className="search-filter-bar d-flex justify-content-between align-items-center mb-3">
        <div className="position-relative flex-grow-1 me-3">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search routes..."
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
        </select>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start</th>
              <th>End</th>
              <th>Distance</th>
              <th>Time</th>
              <th>Status</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route) => (
              <tr key={route._id || route.routeId}>
                <td>{route.routeId || route._id}</td>
                <td>{route.routeName}</td>
                <td>{route.startLocation}</td>
                <td>{route.endLocation}</td>
                <td>
                  {route.totalDistance !== undefined && route.totalDistance !== null
                    ? `${route.totalDistance} km`
                    : ""}
                </td>
                <td>{route.estimatedTime}</td>
                <td>
                  <span
                    className={`badge bg-${
                      route.status === "Active" ? "success" : "secondary"
                    }`}
                  >
                    <FaCheckCircle className="me-1" />
                    {route.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(route)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => confirmDelete(route)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRoutes.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">
                  No routes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete{" "}
                <strong>{routeToDelete?.routeName}</strong>?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirmed}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;
