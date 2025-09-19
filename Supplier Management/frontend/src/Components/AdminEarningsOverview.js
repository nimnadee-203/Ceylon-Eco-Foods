// frontend/src/Components/AdminEarningsOverview.js
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminEarningsOverview() {
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    totalPaidOut: 0,
    totalPendingPayments: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    pendingSubmissions: 0
  });
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEarningsStats();
  }, []);

  const loadEarningsStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Get all suppliers with their earnings data
      const suppliersRes = await axios.get("http://localhost:5001/Suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Get all submissions
      const submissionsRes = await axios.get("http://localhost:5001/Requests/submissions", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const suppliers = suppliersRes.data;
      const submissions = submissionsRes.data;

      // Calculate statistics
      const totalPaidOut = suppliers.reduce((sum, s) => sum + (s.earnings || 0), 0);
      const totalPendingPayments = suppliers.reduce((sum, s) => sum + (s.pendingPayments || 0), 0);
      const acceptedSubmissions = submissions.filter(s => s.status === 'accepted');
      const pendingSubmissions = submissions.filter(s => s.status === 'pending');

      setStats({
        totalSuppliers: suppliers.length,
        totalPaidOut,
        totalPendingPayments,
        totalSubmissions: submissions.length,
        acceptedSubmissions: acceptedSubmissions.length,
        pendingSubmissions: pendingSubmissions.length
      });

      // Get top 5 suppliers by earnings
      const topSuppliers = suppliers
        .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
        .slice(0, 5)
        .map(supplier => ({
          ...supplier,
          totalEarnings: supplier.earnings || 0,
          pendingAmount: supplier.pendingPayments || 0
        }));

      setTopSuppliers(topSuppliers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load earnings statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading earnings statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "crimson" }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginBottom: 20, color: "#333" }}>📊 System Earnings Overview</h3>
      
      {/* Statistics Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: 16, 
        marginBottom: 24 
      }}>
        <div style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: 20,
          borderRadius: 8,
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Total Paid Out</h4>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
            LKR {stats.totalPaidOut.toLocaleString()}
          </p>
        </div>

        <div style={{
          backgroundColor: "#FF9800",
          color: "white",
          padding: 20,
          borderRadius: 8,
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Pending Payments</h4>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
            LKR {stats.totalPendingPayments.toLocaleString()}
          </p>
        </div>

        <div style={{
          backgroundColor: "#2196F3",
          color: "white",
          padding: 20,
          borderRadius: 8,
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Active Suppliers</h4>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
            {stats.totalSuppliers}
          </p>
        </div>

        <div style={{
          backgroundColor: "#9C27B0",
          color: "white",
          padding: 20,
          borderRadius: 8,
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Accepted Submissions</h4>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
            {stats.acceptedSubmissions}
          </p>
        </div>
      </div>

      {/* Payment Flow Visualization */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 12 }}>Payment Flow</h4>
        <div style={{
          backgroundColor: "#f0f0f0",
          borderRadius: 8,
          padding: 16,
          border: "1px solid #ddd"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Total Paid to Suppliers</span>
            <span style={{ fontWeight: "bold" }}>LKR {stats.totalPaidOut.toLocaleString()}</span>
          </div>
          <div style={{
            width: "100%",
            height: 20,
            backgroundColor: "#e0e0e0",
            borderRadius: 10,
            overflow: "hidden"
          }}>
            <div style={{
              width: `${Math.min(100, (stats.totalPaidOut / Math.max(stats.totalPaidOut + stats.totalPendingPayments, 1)) * 100)}%`,
              height: "100%",
              backgroundColor: "#4CAF50",
              transition: "width 0.3s ease"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "#666" }}>
            <span>Pending: LKR {stats.totalPendingPayments.toLocaleString()}</span>
            <span>Total Budget: LKR {(stats.totalPaidOut + stats.totalPendingPayments).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Top Suppliers */}
      <div>
        <h4 style={{ marginBottom: 12 }}>Top Earning Suppliers</h4>
        {topSuppliers.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>No suppliers yet</p>
        ) : (
          <div style={{
            backgroundColor: "#f9f9f9",
            borderRadius: 8,
            border: "1px solid #ddd",
            overflow: "hidden"
          }}>
            {topSuppliers.map((supplier, index) => (
              <div key={supplier._id} style={{
                padding: 12,
                borderBottom: index < topSuppliers.length - 1 ? "1px solid #eee" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <strong>{supplier.name}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {supplier.email}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold", color: "#4CAF50" }}>
                    LKR {supplier.totalEarnings.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: "#FF9800" }}>
                    Pending: LKR {supplier.pendingAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
