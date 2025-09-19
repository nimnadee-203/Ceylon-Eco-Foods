import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();
  axios.post("http://localhost:5000/Adminlogin", admin)
  .then((res) => {
    // Set role and login flag
    localStorage.setItem("role", "admin");
    localStorage.setItem("adminLoggedIn", "true");

    // Save admin data if returned from backend
    if (res.data.admin) {
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
    }

    window.dispatchEvent(new Event("loginStatusChange"));
    alert("Login Success");
    navigate("/admin-dashboard"); // redirect
  })

    .catch(err => alert(err.response?.data?.message || err.message));
};


  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" value={admin.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" value={admin.password} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
