// frontend/src/Components/SupplierEarningsDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SupplierEarningsDashboard() {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    pendingSubmissions: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEarningsData();
  }, []);

  const loadEarningsData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Get supplier profile with earnings
      const profileRes = await axios.get("http://localhost:5001/Suppliers/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Get supplier's submissions
      const submissionsRes = await axios.get("http://localhost:5001/Requests/submissions/mine", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const supplier = profileRes.data;
      const submissions = submissionsRes.data;

      // Calculate statistics
      const acceptedSubmissions = submissions.filter(s => s.status === 'accepted');
      const pendingSubmissions = submissions.filter(s => s.status === 'pending');
      const totalPaid = acceptedSubmissions.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
      const totalPending = pendingSubmissions.reduce((sum, s) => sum + (s.supplierAmount || 0), 0);

      setEarnings({
        totalEarnings: supplier.earnings || 0,
        pendingPayments: supplier.pendingPayments || 0,
        totalSubmissions: submissions.length,
        acceptedSubmissions: acceptedSubmissions.length,
        pendingSubmissions: pendingSubmissions.length
      });

      setRecentSubmissions(submissions.slice(0, 5)); // Show last 5 submissions
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading earnings data...</p>
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
      <h3 style={{ marginBottom: 20, color: "#333" }}>💰 Earnings Dashboard</h3>
      
      {/* Earnings Overview Cards */}
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
          <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Total Earnings</h4>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
            LKR {earnings.totalEarnings.toLocaleString()}
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
            LKR {earnings.pendingPayments.toLocaleString()}
          </p>
        </div>

        <div style={{
          backgroundColor: "#2196F3",
          color: "white",
          padding: 20,
          borderRadius: 8,
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Accepted Submissions</h4>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
            {earnings.acceptedSubmissions}
          </p>
        </div>

        <div style={{
          backgroundColor: "#9C27B0",
          color: "white",
          padding: 20,
          borderRadius: 8,
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: 14, opacity: 0.9 }}>Pending Submissions</h4>
          <p style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>
            {earnings.pendingSubmissions}
          </p>
        </div>
      </div>

      {/* Earnings Progress Bar */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 12 }}>Earnings Progress</h4>
        <div style={{
          backgroundColor: "#f0f0f0",
          borderRadius: 8,
          padding: 16,
          border: "1px solid #ddd"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Confirmed Earnings</span>
            <span style={{ fontWeight: "bold" }}>LKR {earnings.totalEarnings.toLocaleString()}</span>
          </div>
          <div style={{
            width: "100%",
            height: 20,
            backgroundColor: "#e0e0e0",
            borderRadius: 10,
            overflow: "hidden"
          }}>
            <div style={{
              width: `${Math.min(100, (earnings.totalEarnings / Math.max(earnings.totalEarnings + earnings.pendingPayments, 1)) * 100)}%`,
              height: "100%",
              backgroundColor: "#4CAF50",
              transition: "width 0.3s ease"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "#666" }}>
            <span>Pending: LKR {earnings.pendingPayments.toLocaleString()}</span>
            <span>Total Potential: LKR {(earnings.totalEarnings + earnings.pendingPayments).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div>
        <h4 style={{ marginBottom: 12 }}>Recent Submissions</h4>
        {recentSubmissions.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>No submissions yet</p>
        ) : (
          <div style={{
            backgroundColor: "#f9f9f9",
            borderRadius: 8,
            border: "1px solid #ddd",
            overflow: "hidden"
          }}>
            {recentSubmissions.map((submission, index) => (
              <div key={submission._id} style={{
                padding: 12,
                borderBottom: index < recentSubmissions.length - 1 ? "1px solid #eee" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <strong>{submission.request?.title || "Unknown Request"}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: "bold",
                    backgroundColor: 
                      submission.status === 'accepted' ? "#4CAF50" :
                      submission.status === 'pending' ? "#FF9800" : "#f44336",
                    color: "white"
                  }}>
                    {submission.status.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    LKR {submission.supplierAmount?.toLocaleString() || 0}
                    {submission.paidAmount && submission.paidAmount !== submission.supplierAmount && (
                      <span style={{ color: "#4CAF50" }}>
                        {" "}(Paid: {submission.paidAmount.toLocaleString()})
                      </span>
                    )}
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
