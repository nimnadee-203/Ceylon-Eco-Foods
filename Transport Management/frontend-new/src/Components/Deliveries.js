import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    address: "",
    deliveriesDate: "",
    status: "pending",
  });

  const [editingId, setEditingId] = useState(null);

  // ✅ Modal states
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/deliveries");
      setDeliveries(res.data.deliveries || res.data);
    } catch (err) {
      console.error(err);
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
        await axios.put(`http://localhost:5000/deliveries/${editingId}`, formData);
        showToastMessage("Delivery updated successfully ✅");
      } else {
        await axios.post("http://localhost:5000/deliveries", formData);
        showToastMessage("Delivery added successfully ✅");
      }
      setFormData({ orderId: "", customerName: "", address: "", deliveriesDate: "", status: "pending" });
      setEditingId(null);
      fetchDeliveries();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Confirm delete modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // ✅ Final delete
  const handleDelete = async () => {
    if (deleteId) {
      await axios.delete(`http://localhost:5000/deliveries/${deleteId}`);
      fetchDeliveries();
      setDeleteId(null);
      showToastMessage("Delivery deleted successfully 🗑️");
    }
    setShowModal(false);
  };

  const handleEdit = (delivery) => {
    setFormData(delivery);
    setEditingId(delivery._id);
  };

  // ✅ UPDATED EXPORT FUNCTION
  const exportPDF = () => {
    const doc = new jsPDF();

    // Company Name
    doc.setFontSize(20);
    doc.text("Ceylon Eco Foods", 14, 20);

    // Address
    doc.setFontSize(12);
    doc.text("123, Galle Road, Colombo, Sri Lanka", 14, 30);

    // Report Title
    doc.setFontSize(14);
    doc.text("Delivery Report", 14, 40);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [["Order ID", "Customer", "Address", "Date", "Status"]],
      body: deliveries.map((d) => [
        d.orderId,
        d.customerName,
        d.address,
        new Date(d.deliveriesDate).toLocaleString(),
        d.status,
      ]),
    });

    doc.save("deliveries.pdf");
  };

  // ✅ Filter (Order ID ain karala, only Customer + Address + Status)
  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      (delivery.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.address?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All Status" || delivery.status.toLowerCase() === statusFilter.toLowerCase())
  );

  // ✅ Toast function
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h1 className="h3">Delivery Management</h1>
          <p className="text-muted">Track and manage all deliveries</p>
        </div>
        <button className="btn btn-success" onClick={exportPDF}>
          <FaDownload className="me-2" />
          Download PDF
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="row g-2 mb-4">
        <div className="col-md-2">
          <input
            name="orderId"
            className="form-control"
            placeholder="Order ID"
            value={formData.orderId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            name="customerName"
            className="form-control"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            name="address"
            className="form-control"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="datetime-local"
            name="deliveriesDate"
            className="form-control"
            value={formData.deliveriesDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <select
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-1 text-end">
          <button className="btn btn-primary w-100" type="submit">
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Search + Filter */}
      <div className="d-flex justify-content-between mb-3">
        <div className="position-relative flex-grow-1 me-3">
          <FaSearch className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
          <input
            type="text"
            className="form-control ps-4"
            placeholder="Search by customer or address..."
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
          <option>Pending</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Date</th>
            <th>Status</th>
            <th style={{ width: "100px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeliveries.map((d) => (
            <tr key={d._id}>
              <td>{d.orderId}</td>
              <td>{d.customerName}</td>
              <td>{d.address}</td>
              <td>{new Date(d.deliveriesDate).toLocaleString()}</td>
              <td>{d.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEdit(d)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => confirmDelete(d._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                <p>Are you sure you want to delete this delivery?</p>
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

export default Deliveries;
