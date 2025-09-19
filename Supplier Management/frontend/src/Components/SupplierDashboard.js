// frontend/src/Components/SupplierDashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import SupplierEarningsDashboard from "./SupplierEarningsDashboard";

export default function SupplierDashboard() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState(null);
  const [supplierData, setSupplierData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        // decode token payload (lightweight)
        const base64 = token.split('.')[1];
        const json = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
        setMe(json);

        // Load full supplier data including rating
        const response = await fetch("http://localhost:5001/Suppliers/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSupplierData(data);
        }
      } catch (e) {
        setErr("Failed to load user details");
      }
    };
    
    loadUserData();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: "#FFD700", fontSize: 18 }}>★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" style={{ color: "#FFD700", fontSize: 18 }}>☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: "#ddd", fontSize: 18 }}>★</span>);
    }
    
    return stars;
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2>Supplier Dashboard</h2>
          <p>Welcome, <strong>{me?.name || "Supplier"}</strong></p>
          <p>Role: {me?.role}</p>
          {supplierData && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: "bold" }}>Rating:</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {renderStars(supplierData.rating || 0)}
                  <span style={{ fontSize: 14, color: "#666", marginLeft: 4 }}>
                    ({supplierData.rating?.toFixed(1) || "0.0"}) - {supplierData.ratingCount || 0} reviews
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <Logout redirect="/supplier/login" />
      </div>

      {err && <p style={{color:"crimson"}}>{err}</p>}

      {/* Earnings Dashboard */}
      <div style={{ marginBottom: 24 }}>
        <SupplierEarningsDashboard />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={{ 
          border: "1px solid #ddd", 
          borderRadius: 8, 
          padding: 20,
          backgroundColor: "#f9f9f9"
        }}>
          <h3 style={{ margin: "0 0 12px 0" }}>Available Requests</h3>
          <p style={{ color: "#666", margin: "0 0 16px 0" }}>
            Browse and respond to supply requests from administrators.
          </p>
          <Link 
            to="/supplier/requests"
            style={{ 
              padding: "8px 16px", 
              backgroundColor: "#4CAF50", 
              color: "white", 
              textDecoration: "none", 
              borderRadius: 4,
              fontSize: 14
            }}
          >
            View Available Requests
          </Link>
        </div>

        <div style={{ 
          border: "1px solid #ddd", 
          borderRadius: 8, 
          padding: 20,
          backgroundColor: "#f9f9f9"
        }}>
          <h3 style={{ margin: "0 0 12px 0" }}>My Submissions</h3>
          <p style={{ color: "#666", margin: "0 0 16px 0" }}>
            Track your submitted supply offers and their status.
          </p>
          <Link 
            to="/supplier/submissions"
            style={{ 
              padding: "8px 16px", 
              backgroundColor: "#2196F3", 
              color: "white", 
              textDecoration: "none", 
              borderRadius: 4,
              fontSize: 14
            }}
          >
            View My Submissions
          </Link>
        </div>
      </div>
    </div>
  );
}
