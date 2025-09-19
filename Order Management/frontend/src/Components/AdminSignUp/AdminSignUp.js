import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminSignUp() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (admin.password !== admin.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  axios.post("http://localhost:5000/Adminsignup", admin)
    .then(() => {
      // Set admin as logged in
      localStorage.setItem("adminLoggedIn", true);  
      alert("Admin Signed Up Successfully");
      navigate("/AdminDashboard"); // redirect to dashboard
    })
    .catch(err => alert(err.response?.data?.error || err.message));
};

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Admin Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input type="text" name="fullName" value={admin.fullName} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" value={admin.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" value={admin.password} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={admin.confirmPassword} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  );
}

export default AdminSignUp;
