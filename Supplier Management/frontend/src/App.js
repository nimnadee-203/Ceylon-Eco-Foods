// frontend/src/App.js
// Main app routes for the Food Supply Management frontend.
// Uses react-router v6 and the Components in ./Components/*

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SupplierSignup from "./Components/SupplierSignup";
import SupplierLogin from "./Components/SupplierLogin";
import AdminLogin from "./Components/AdminLogin";
import SupplierDashboard from "./Components/SupplierDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminCreateRequest from "./Components/AdminCreateRequest";
import AdminRequestsList from "./Components/AdminRequestsList";
import AdminViewSubmissions from "./Components/AdminViewSubmissions";
import SupplierRequestsList from "./Components/SupplierRequestsList";
import SupplierSubmit from "./Components/SupplierSubmit";
import SupplierMySubmissions from "./Components/SupplierMySubmissions";
import AdminManageSuppliers from "./Components/AdminManageSuppliers";
import AdminSuppliersList from "./Components/AdminSuppliersList";
import AdminAddSupplier from "./Components/AdminAddSupplier";
import AdminEditSupplier from "./Components/AdminEditSupplier";

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>404 — Not Found</h2>
      <p>The page you're looking for does not exist.</p>
      <a href="/supplier/login">Go to Login</a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Root */}
        <Route path="/" element={<Navigate to="/supplier/login" replace />} />

        {/* Public auth routes */}
        <Route path="/supplier/signup" element={<SupplierSignup />} />
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin routes */}
        <Route path="/admin/create-request" element={<AdminCreateRequest />} />
        <Route path="/admin/requests" element={<AdminRequestsList />} />
        <Route path="/admin/requests/:id/submissions" element={<AdminViewSubmissions />} />
        <Route path="/admin/manage-suppliers" element={<AdminManageSuppliers />} />

        {/* Supplier routes */}
        <Route path="/supplier/requests" element={<SupplierRequestsList />} />
        <Route path="/supplier/requests/:id/submit" element={<SupplierSubmit />} />
        <Route path="/supplier/submissions" element={<SupplierMySubmissions />} />

        {/* Supplier management routes (admin-only) */}
        <Route
          path="/admin/suppliers"
          element={
            <ProtectedRoute role="admin">
              <AdminSuppliersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/suppliers/new"
          element={
            <ProtectedRoute role="admin">
              <AdminAddSupplier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/suppliers/:id/edit"
          element={
            <ProtectedRoute role="admin">
              <AdminEditSupplier />
            </ProtectedRoute>
          }
        />

        {/* Protected dashboards */}
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute role="supplier">
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
