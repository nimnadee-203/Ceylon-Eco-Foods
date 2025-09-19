// frontend/src/Components/SupplierMySubmissions.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SupplierMySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all", // all, pending, accepted, rejected
    sortBy: "createdAt", // createdAt, supplierAmount, status
    sortOrder: "desc" // asc, desc
  });

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5001/Requests/submissions/mine", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubmissions(res.data || []);
    } catch (err) {
      console.error("Failed to load submissions:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (filters.status !== "all") {
      return submission.status === filters.status;
    }
    return true;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (filters.sortBy) {
      case "createdAt":
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      case "supplierAmount":
        aValue = a.supplierAmount || 0;
        bValue = b.supplierAmount || 0;
        break;
      case "status":
        aValue = a.status || "";
        bValue = b.status || "";
        break;
      default:
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
    }

    if (filters.sortOrder === "desc") {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return { background: "#4CAF50", color: "white" };
      case "pending":
        return { background: "#FF9800", color: "white" };
      case "rejected":
        return { background: "#f44336", color: "white" };
      default:
        return { background: "#9E9E9E", color: "white" };
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(value || 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading your submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "crimson" }}>
        <p>Error: {error}</p>
        <button onClick={loadSubmissions} style={{ marginTop: 10, padding: "8px 16px" }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2>My Submissions</h2>
          <p style={{ color: "#666", margin: 0 }}>
            Track your submitted supply offers and their status
          </p>
        </div>
        <Link 
          to="/supplier/dashboard"
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#6c757d", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: 4 
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Summary Cards */}
      {submissions.length > 0 && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <div style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: 16,
            borderRadius: 8,
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Total Submissions</h4>
            <p style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
              {submissions.length}
            </p>
          </div>

          <div style={{
            backgroundColor: "#FF9800",
            color: "white",
            padding: 16,
            borderRadius: 8,
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Pending Review</h4>
            <p style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
              {submissions.filter(s => s.status === 'pending').length}
            </p>
          </div>

          <div style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: 16,
            borderRadius: 8,
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Accepted</h4>
            <p style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
              {submissions.filter(s => s.status === 'accepted').length}
            </p>
          </div>

          <div style={{
            backgroundColor: "#9C27B0",
            color: "white",
            padding: 16,
            borderRadius: 8,
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Total Value</h4>
            <p style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
              {formatCurrency(submissions.reduce((sum, s) => sum + (s.supplierAmount || 0), 0))}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        border: "1px solid #dee2e6", 
        borderRadius: 8, 
        padding: 16, 
        marginBottom: 16 
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: "bold" }}>
              Status Filter
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              style={{
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ced4da"
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: "bold" }}>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              style={{
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ced4da"
              }}
            >
              <option value="createdAt">Date Submitted</option>
              <option value="supplierAmount">Amount</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: "bold" }}>
              Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
              style={{
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ced4da"
              }}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <button
            onClick={loadSubmissions}
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              marginTop: 20
            }}
            title="Refresh Data"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Results Counter */}
      <div style={{ 
        marginBottom: 12, 
        padding: "8px 12px", 
        backgroundColor: "#e3f2fd", 
        borderRadius: 6,
        border: "1px solid #bbdefb"
      }}>
        <span style={{ fontSize: 14, color: "#1976d2" }}>
          Showing {filteredSubmissions.length} of {submissions.length} submissions
          {filteredSubmissions.length !== submissions.length && (
            <span style={{ color: "#666", marginLeft: 8 }}>
              (filtered by status)
            </span>
          )}
        </span>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px 20px", 
          color: "#666",
          backgroundColor: "#f8f9fa",
          borderRadius: 8,
          border: "1px solid #dee2e6"
        }}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>📝 No submissions found</div>
          <div style={{ fontSize: 14 }}>
            {filters.status !== "all" ? (
              <>
                No submissions match your current filter.
                <br />
                <button
                  onClick={() => setFilters({...filters, status: "all"})}
                  style={{
                    marginTop: 8,
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  Clear Filter
                </button>
              </>
            ) : (
              <>
                You haven't submitted any supply offers yet.
                <br />
                <Link 
                  to="/supplier/requests"
                  style={{
                    marginTop: 8,
                    padding: "6px 12px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: 4,
                    display: "inline-block"
                  }}
                >
                  Browse Available Requests
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
                <th style={{ padding: "10px 8px" }}>Request</th>
                <th style={{ padding: "10px 8px" }}>Items</th>
                <th style={{ padding: "10px 8px" }}>Amount</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
                <th style={{ padding: "10px 8px" }}>Submitted</th>
                <th style={{ padding: "10px 8px" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ fontWeight: 600 }}>
                      {submission.request?.title || "Unknown Request"}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {submission.request?.description || "No description"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ fontSize: 14 }}>
                      {submission.items?.length || 0} items
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {submission.items?.slice(0, 2).map(item => item.name).join(", ")}
                      {submission.items?.length > 2 && "..."}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ fontWeight: "bold", color: "#4CAF50" }}>
                      {formatCurrency(submission.supplierAmount)}
                    </div>
                    {submission.paidAmount && submission.paidAmount !== submission.supplierAmount && (
                      <div style={{ fontSize: 12, color: "#FF9800" }}>
                        Paid: {formatCurrency(submission.paidAmount)}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: "bold",
                      ...getStatusColor(submission.status)
                    }}>
                      {submission.status?.toUpperCase() || "UNKNOWN"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ fontSize: 14 }}>
                      {formatDate(submission.createdAt)}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ fontSize: 12, color: "#666", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {submission.notes || "No notes"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
