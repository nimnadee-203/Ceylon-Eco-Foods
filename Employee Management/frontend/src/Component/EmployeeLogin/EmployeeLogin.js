import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function EmployeeLogin() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/employees/login", {
        email: employee.email,
        password: employee.password,
      });

      // Login success
      alert("Login Success");

      // Save role and login flag
      localStorage.setItem("role", "employee");
      localStorage.setItem("employeeLoggedIn", "true");

      // Save employee details returned from backend
      if (res.data.employee) {
        localStorage.setItem("employee", JSON.stringify(res.data.employee));
      }

      // Dispatch login event for app-wide status update
      window.dispatchEvent(new Event("loginStatusChange"));

      // Redirect to dashboard
      navigate("/employee-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            value={employee.email}
            onChange={handleInputChange}
            className="form-control"
            id="email"
            name="email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            value={employee.password}
            onChange={handleInputChange}
            className="form-control"
            id="password"
            name="password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">LOGIN</button>
      </form>
    </div>
  )
}

export default EmployeeLogin;
