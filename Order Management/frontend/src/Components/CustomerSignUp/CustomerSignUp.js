import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function CustomerSignUp() {

  const navigate = useNavigate();
  const [customer, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: ""
  });

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setUser((prevUser) => ({
    ...prevUser,
    [name]: value
  }));
};

const handleSubmit =(e) => {
    e.preventDefault();

   sendRequest()
  .then(() => {
    alert("Successfully Signed Up");
    navigate("/CustomerDashboard"); // ✅ use navigate instead of history
  })
  .catch((err) => {
    alert(err.message);
  });

}

const sendRequest = async () => {
  await axios.post("http://localhost:5000/Customersignup", {
    fullName: customer.fullName,
    email: customer.email,
    password: customer.password,
    confirmPassword: customer.confirmPassword,
    contactNumber: customer.contactNumber,
    address: customer.address,
  });
};


  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Customer Sign Up</h2>
   <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="fullName" className="form-label">Full Name</label>
    <input
      type="text"
      value={customer.fullName}
      onChange={handleInputChange}
      className="form-control"
      id="fullName"
      name="fullName"
      required
    />
  </div>

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

  <div className="mb-3">
    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
    <input
      type="password"
      value={customer.confirmPassword}
      onChange={handleInputChange}
      className="form-control"
      id="confirmPassword"
      name="confirmPassword"
      required
    />
  </div>

  <div className="mb-3">
    <label htmlFor="contactNumber" className="form-label">Contact Number</label>
    <input
      type="text"
      value={customer.contactNumber}
      onChange={handleInputChange}
      className="form-control"
      id="contactNumber"
      name="contactNumber"
      required
    />
  </div>

  <div className="mb-3">
    <label htmlFor="address" className="form-label">Address</label>
    <input
      type="text"
      value={customer.address}
      onChange={handleInputChange}
      className="form-control"
      id="address"
      name="address"
      required
    />
  </div>

  <button type="submit" className="btn btn-primary w-100">Sign Up</button>
</form>

    </div>
  );
}

export default CustomerSignUp;
