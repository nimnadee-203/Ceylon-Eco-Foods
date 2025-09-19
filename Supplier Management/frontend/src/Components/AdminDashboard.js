// frontend/src/Components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import AdminEarningsOverview from "./AdminEarningsOverview";

/**
 * Admin dashboard page
 * - Shows quick links and system overview
 * - Provides navigation to Manage Suppliers page
 */

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    // base64url -> base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function AdminDashboard() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = parseJwt(token);
        if (!payload) {
          setErr("Failed to decode token");
          return;
        }
        setMe(payload);
      } catch (e) {
        setErr("Failed to load user details");
      }
    }
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p>Welcome, <strong>{me?.name || "Admin"}</strong></p>
          <p>Role: {me?.role || "admin"}</p>
        </div>
        <Logout redirect="/admin/login" />
      </div>

      {err && <p style={{color:"crimson"}}>{err}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={{ 
          border: "1px solid #ddd", 
          borderRadius: 8, 
          padding: 20,
          backgroundColor: "#f9f9f9"
        }}>
          <h3 style={{ margin: "0 0 12px 0" }}>Request Management</h3>
          <p style={{ color: "#666", margin: "0 0 16px 0" }}>
            Create new requests and manage existing ones.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link 
              to="/admin/create-request"
              style={{ 
                padding: "8px 16px", 
                backgroundColor: "#4CAF50", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: 4,
                fontSize: 14
              }}
            >
              Create Request
            </Link>
            <Link 
              to="/admin/requests"
              style={{ 
                padding: "8px 16px", 
                backgroundColor: "#2196F3", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: 4,
                fontSize: 14
              }}
            >
              View All Requests
            </Link>
          </div>
        </div>

        <div style={{ 
          border: "1px solid #ddd", 
          borderRadius: 8, 
          padding: 20,
          backgroundColor: "#f9f9f9"
        }}>
          <h3 style={{ margin: "0 0 12px 0" }}>System Overview</h3>
          <p style={{ color: "#666", margin: "0 0 16px 0" }}>
            Monitor system activity and manage suppliers.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link 
              to="/admin/requests"
              style={{ 
                padding: "8px 16px", 
                backgroundColor: "#FF9800", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: 4,
                fontSize: 14
              }}
            >
              View Submissions
            </Link>
          </div>
        </div>

        <div style={{ 
          border: "1px solid #ddd", 
          borderRadius: 8, 
          padding: 20,
          backgroundColor: "#f9f9f9"
        }}>
          <h3 style={{ margin: "0 0 12px 0" }}>Supplier Management</h3>
          <p style={{ color: "#666", margin: "0 0 16px 0" }}>
            Manage suppliers, view ratings, and track performance.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link 
              to="/admin/manage-suppliers"
              style={{ 
                padding: "8px 16px", 
                backgroundColor: "#9C27B0", 
                color: "white", 
                textDecoration: "none", 
                borderRadius: 4,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              👥 Manage Suppliers
            </Link>
          </div>
        </div>
      </div>

      {/* Earnings Overview section */}
      <div style={{ marginTop: 28 }}>
        <AdminEarningsOverview />
      </div>

    </div>
  );
}
