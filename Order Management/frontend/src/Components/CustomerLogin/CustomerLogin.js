import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function CustomerLogin() {
  const navigate = useNavigate();
  const [customer, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  sendRequest()
    .then((res) => {
      alert("Login Success");

      // ✅ Save role and login flag
      localStorage.setItem("role", "customer");
      localStorage.setItem("customerLoggedIn", "true");

      // ✅ Save customer details returned from backend
      if (res.data.customer) {
        localStorage.setItem("customer", JSON.stringify(res.data.customer));
      }

      window.dispatchEvent(new Event("loginStatusChange"));
      navigate("/customer-dashboard"); // redirect
    })
    .catch((err) => {
      alert(err.response?.data?.message || err.message);
    });
};


  const sendRequest = async () => {
    return await axios.post("http://localhost:5000/Customerlogin", {
      email: customer.email,
      password: customer.password,
    });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Customer Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            value={customer.email}
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
            value={customer.password}
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

export default CustomerLogin;
