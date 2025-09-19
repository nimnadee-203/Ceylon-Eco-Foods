// frontend/src/Components/AdminManageSuppliers.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import SupplierRatingModal from "./SupplierRatingModal";

export default function AdminManageSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    status: "all", // all, active, inactive
    earningsRange: "all", // all, high, medium, low, none
    pendingPayments: "all", // all, has_pending, no_pending
    sortBy: "name", // name, earnings, pendingPayments, createdAt
    sortOrder: "asc" // asc, desc
  });
  const [showFilters, setShowFilters] = useState(false);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, supplier: null });
  const navigate = useNavigate();

  // Currency formatter for LKR
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(value || 0);

  const loadSuppliers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/Suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Failed to load suppliers:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRateSupplier = (supplier) => {
    setRatingModal({ isOpen: true, supplier });
  };

  const handleRatingUpdate = () => {
    loadSuppliers(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: "#FFD700" }}>★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" style={{ color: "#FFD700" }}>☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: "#ddd" }}>★</span>);
    }
    
    return stars;
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleDelete = async (id, name) => {
    const ok = window.confirm(`Delete supplier "${name}"? This cannot be undone.`);
    if (!ok) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/Suppliers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers((s) => s.filter((x) => x._id !== id));
    } catch (err) {
      console.error("Delete supplier error:", err.response || err.message);
      alert(err.response?.data?.message || "Failed to delete supplier");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = suppliers.filter((s) => {
    // Text search
    if (query) {
      const q = query.toLowerCase();
      const matchesSearch = (
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.company || "").toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q) ||
        (s.address || "").toLowerCase().includes(q)
      );
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== "all") {
      const isActive = s.active !== false;
      if (filters.status === "active" && !isActive) return false;
      if (filters.status === "inactive" && isActive) return false;
    }

    // Earnings range filter
    if (filters.earningsRange !== "all") {
      const earnings = s.earnings || 0;
      switch (filters.earningsRange) {
        case "high":
          if (earnings < 50000) return false;
          break;
        case "medium":
          if (earnings < 10000 || earnings >= 50000) return false;
          break;
        case "low":
          if (earnings >= 10000) return false;
          break;
        case "none":
          if (earnings > 0) return false;
          break;
      }
    }

    // Pending payments filter
    if (filters.pendingPayments !== "all") {
      const hasPending = (s.pendingPayments || 0) > 0;
      if (filters.pendingPayments === "has_pending" && !hasPending) return false;
      if (filters.pendingPayments === "no_pending" && hasPending) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sorting logic
    let aValue, bValue;
    
    switch (filters.sortBy) {
      case "name":
        aValue = (a.name || "").toLowerCase();
        bValue = (b.name || "").toLowerCase();
        break;
      case "earnings":
        aValue = a.earnings || 0;
        bValue = b.earnings || 0;
        break;
      case "pendingPayments":
        aValue = a.pendingPayments || 0;
        bValue = b.pendingPayments || 0;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      default:
        aValue = (a.name || "").toLowerCase();
        bValue = (b.name || "").toLowerCase();
    }

    if (filters.sortOrder === "desc") {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });

  return (
    <div style={{ padding: 24 }}>
      {/* Header with Navigation */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Link
            to="/admin/dashboard"
            style={{
              padding: "6px 12px",
              backgroundColor: "#f5f5f5",
              color: "#333",
              textDecoration: "none",
              borderRadius: 6,
              fontSize: 14,
              border: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ margin: 0 }}>Manage Suppliers</h2>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
              View, rate, and manage supplier accounts and performance
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => loadSuppliers(false)}
              disabled={refreshing}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
                fontSize: 14
              }}
            >
              {refreshing ? "Refreshing..." : "🔄 Refresh"}
            </button>
            <button
              onClick={() => navigate("/admin/suppliers/new")}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: 6,
                background: "#4CAF50",
                color: "white",
                cursor: "pointer",
                fontSize: 14
              }}
            >
              ➕ Add Supplier
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            placeholder="Search by name, email, company, phone, or address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #ddd",
              minWidth: 300,
              flex: 1
            }}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: showFilters ? "#FF9800" : "#9C27B0",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer"
            }}
            title="Toggle Filters"
          >
            🔍 Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 style={{ margin: 0, color: "#495057" }}>Advanced Filters</h4>
            <button
              onClick={() => setFilters({
                status: "all",
                earningsRange: "all",
                pendingPayments: "all",
                sortBy: "name",
                sortOrder: "asc"
              })}
              style={{
                background: "#6c757d",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 12
              }}
            >
              Clear All
            </button>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: 16 
          }}>
            {/* Status Filter */}
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: "bold" }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ced4da"
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {/* Earnings Range Filter */}
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: "bold" }}>
                Earnings Range
              </label>
              <select
                value={filters.earningsRange}
                onChange={(e) => setFilters({...filters, earningsRange: e.target.value})}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ced4da"
                }}
              >
                <option value="all">All Earnings</option>
                <option value="high">High (LKR 50,000+)</option>
                <option value="medium">Medium (LKR 10,000 - 49,999)</option>
                <option value="low">Low (LKR 1 - 9,999)</option>
                <option value="none">No Earnings</option>
              </select>
            </div>

            {/* Pending Payments Filter */}
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: "bold" }}>
                Pending Payments
              </label>
              <select
                value={filters.pendingPayments}
                onChange={(e) => setFilters({...filters, pendingPayments: e.target.value})}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ced4da"
                }}
              >
                <option value="all">All Suppliers</option>
                <option value="has_pending">Has Pending Payments</option>
                <option value="no_pending">No Pending Payments</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: "bold" }}>
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ced4da"
                }}
              >
                <option value="name">Name</option>
                <option value="earnings">Earnings</option>
                <option value="pendingPayments">Pending Payments</option>
                <option value="createdAt">Date Created</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: "bold" }}>
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #ced4da"
                }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          <div style={{ marginTop: 12, padding: 8, backgroundColor: "#e9ecef", borderRadius: 4 }}>
            <div style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>
              Active Filters:
            </div>
            <div style={{ fontSize: 12 }}>
              {filters.status !== "all" && <span style={{ background: "#007bff", color: "white", padding: "2px 6px", borderRadius: 3, marginRight: 4 }}>Status: {filters.status}</span>}
              {filters.earningsRange !== "all" && <span style={{ background: "#28a745", color: "white", padding: "2px 6px", borderRadius: 3, marginRight: 4 }}>Earnings: {filters.earningsRange}</span>}
              {filters.pendingPayments !== "all" && <span style={{ background: "#ffc107", color: "black", padding: "2px 6px", borderRadius: 3, marginRight: 4 }}>Pending: {filters.pendingPayments}</span>}
              <span style={{ background: "#6f42c1", color: "white", padding: "2px 6px", borderRadius: 3, marginRight: 4 }}>Sort: {filters.sortBy} ({filters.sortOrder})</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && suppliers.length > 0 && (
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
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Total Paid Out</h4>
            <p style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
              {formatCurrency(suppliers.reduce((sum, s) => sum + (s.earnings || 0), 0))}
            </p>
          </div>

          <div style={{
            backgroundColor: "#FF9800",
            color: "white",
            padding: 16,
            borderRadius: 8,
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Pending Payments</h4>
            <p style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
              {formatCurrency(suppliers.reduce((sum, s) => sum + (s.pendingPayments || 0), 0))}
            </p>
          </div>

          <div style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: 16,
            borderRadius: 8,
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Active Suppliers</h4>
            <p style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
              {suppliers.length}
            </p>
          </div>

          <div style={{
            backgroundColor: "#9C27B0",
            color: "white",
            padding: 16,
            borderRadius: 8,
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Total Budget</h4>
            <p style={{ margin: 0, fontSize: 20, fontWeight: "bold" }}>
              {formatCurrency(suppliers.reduce((sum, s) => sum + (s.earnings || 0) + (s.pendingPayments || 0), 0))}
            </p>
          </div>
        </div>
      )}

      {/* Results Counter */}
      {!loading && !error && (
        <div style={{ 
          marginBottom: 12, 
          padding: "8px 12px", 
          backgroundColor: "#e3f2fd", 
          borderRadius: 6,
          border: "1px solid #bbdefb"
        }}>
          <span style={{ fontSize: 14, color: "#1976d2" }}>
            Showing {filtered.length} of {suppliers.length} suppliers
            {filtered.length !== suppliers.length && (
              <span style={{ color: "#666", marginLeft: 8 }}>
                (filtered by search and filters)
              </span>
            )}
          </span>
        </div>
      )}

      {loading ? (
        <div>Loading suppliers...</div>
      ) : error ? (
        <div style={{ color: "crimson" }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px 20px", 
          color: "#666",
          backgroundColor: "#f8f9fa",
          borderRadius: 8,
          border: "1px solid #dee2e6"
        }}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>🔍 No suppliers found</div>
          <div style={{ fontSize: 14 }}>
            {query || Object.values(filters).some(f => f !== "all") ? (
              <>
                Try adjusting your search terms or filters.
                <br />
                <button
                  onClick={() => {
                    setQuery("");
                    setFilters({
                      status: "all",
                      earningsRange: "all",
                      pendingPayments: "all",
                      sortBy: "name",
                      sortOrder: "asc"
                    });
                  }}
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
                  Clear All Filters
                </button>
              </>
            ) : (
              "No suppliers have been registered yet."
            )}
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
                <th style={{ padding: "10px 8px" }}>Supplier</th>
                <th style={{ padding: "10px 8px" }}>Materials</th>
                <th style={{ padding: "10px 8px" }}>Rating</th>
                <th style={{ padding: "10px 8px" }}>Total Orders</th>
                <th style={{ padding: "10px 8px" }}>Items Supplied</th>
                <th style={{ padding: "10px 8px" }}>Earnings</th>
                <th style={{ padding: "10px 8px" }}>Pending Payments</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
                <th style={{ padding: "10px 8px" }}>Functions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const materialsCount = Array.isArray(s.supplies) ? s.supplies.length : (s.materialsCount || 0);
                const rating = typeof s.rating === "number" ? s.rating : (s.rating ? s.rating : 0);
                const status = s.active === false ? "Inactive" : "Active";

                return (
                  <tr key={s._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 13, color: "#666" }}>{s.email}</div>
                      {s.company && <div style={{ fontSize: 13, color: "#666" }}>{s.company}</div>}
                    </td>
                    <td style={{ padding: "12px 8px" }}>{materialsCount}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 16 }}>
                            {renderStars(rating)}
                          </div>
                          <div style={{ fontSize: 12, color: "#666" }}>
                            {rating.toFixed ? rating.toFixed(1) : rating} ({s.ratingCount || 0} reviews)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 8px" }}>{s.totalOrders || 0}</td>
                    <td style={{ padding: "12px 8px" }}>{s.totalItemsSupplied || 0}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ 
                        color: "#4CAF50", 
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}>
                        {formatCurrency(s.earnings)}
                      </div>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#666" 
                      }}>
                        Total Paid
                      </div>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ 
                        color: s.pendingPayments > 0 ? "#FF9800" : "#666", 
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}>
                        {formatCurrency(s.pendingPayments)}
                      </div>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#666" 
                      }}>
                        Awaiting Payment
                      </div>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span style={{
                        background: status === "Active" ? "#e6f4ff" : "#fff0f0",
                        color: status === "Active" ? "#0b74de" : "#d9534f",
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 13
                      }}>{status}</span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <button
                          onClick={() => handleRateSupplier(s)}
                          style={{
                            padding: "4px 6px",
                            borderRadius: 4,
                            border: "1px solid #FFD700",
                            background: "#fff9e6",
                            color: "#b8860b",
                            cursor: "pointer",
                            fontSize: 12
                          }}
                          title="Rate this supplier"
                        >
                          ⭐ Rate
                        </button>
                        <button
                          onClick={() => navigate(`/admin/suppliers/${s._id}/edit`)}
                          style={{
                            padding: "4px 6px",
                            borderRadius: 4,
                            border: "1px solid #ccc",
                            background: "white",
                            cursor: "pointer",
                            fontSize: 12
                          }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(s._id, s.name)}
                          disabled={deleting === s._id}
                          style={{
                            padding: "4px 6px",
                            borderRadius: 4,
                            border: "1px solid #e0b4b4",
                            background: "#fff5f5",
                            color: "#c72b2b",
                            cursor: "pointer",
                            fontSize: 12
                          }}
                        >
                          {deleting === s._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Rating Modal */}
      <SupplierRatingModal
        supplier={ratingModal.supplier}
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, supplier: null })}
        onRatingUpdate={handleRatingUpdate}
      />
    </div>
  );
}
