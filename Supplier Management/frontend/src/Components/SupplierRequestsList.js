// frontend/src/Components/SupplierRequestsList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SupplierRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/Requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Load requests error:", err.response?.data || err.message);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "#4CAF50",
      partially_supplied: "#FF9800",
      supplied: "#2196F3",
      closed: "#9E9E9E"
    };
    return colors[status] || "#666";
  };

  if (loading) return <div style={{ padding: 24 }}>Loading requests...</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2>Available Requests</h2>
        <button 
          onClick={loadRequests}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#666", 
            color: "white", 
            border: "none", 
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div style={{ 
          padding: 24, 
          textAlign: "center", 
          backgroundColor: "#f5f5f5", 
          borderRadius: 8,
          color: "#666"
        }}>
          No open requests available at the moment.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {requests.map((request) => (
            <div key={request._id} style={{ 
              border: "1px solid #ddd", 
              borderRadius: 8, 
              padding: 16,
              backgroundColor: "#f9f9f9"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <h3 style={{ margin: 0, color: "#333" }}>{request.title}</h3>
                <span style={{ 
                  padding: "4px 8px", 
                  backgroundColor: getStatusColor(request.status), 
                  color: "white", 
                  borderRadius: 4,
                  fontSize: 12,
                  textTransform: "uppercase"
                }}>
                  {request.status}
                </span>
              </div>

              {request.description && (
                <p style={{ margin: "0 0 12px 0", color: "#666" }}>{request.description}</p>
              )}

              <div style={{ marginBottom: 12 }}>
                <strong>Items needed:</strong>
                <ul style={{ margin: "4px 0 0 20px" }}>
                  {request.items.map((item, index) => (
                    <li key={index}>{item.name} - {item.qty} units</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, color: "#666" }}>
                <span>Due: {formatDate(request.dueDate)}</span>
                <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
              </div>

              <div style={{ marginTop: 12 }}>
                <Link 
                  to={`/supplier/requests/${request._id}/submit`}
                  style={{ 
                    padding: "8px 16px", 
                    backgroundColor: "#4CAF50", 
                    color: "white", 
                    textDecoration: "none", 
                    borderRadius: 4,
                    display: "inline-block"
                  }}
                >
                  Submit Supply
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}