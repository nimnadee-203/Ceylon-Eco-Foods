// frontend/src/Components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute checks for token existence in localStorage.
 * Optionally checks role by decoding JWT payload (simple base64 decode).
 *
 * Usage:
 * <Route path="/supplier/dashboard" element={<ProtectedRoute role="supplier"><SupplierDashboard/></ProtectedRoute>} />
 */
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/supplier/login" replace />;

  if (role) {
    const payload = parseJwt(token);
    if (!payload || payload.role !== role) {
      // redirect to login page (or a forbidden page)
      return <Navigate to="/supplier/login" replace />;
    }
  }

  return children;
}
