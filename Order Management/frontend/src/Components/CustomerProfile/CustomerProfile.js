import React, { useState, useEffect } from "react";
import axios from "axios";

function CustomerProfile() {
  const [customer, setCustomer] = useState({});
  const [editMode, setEditMode] = useState(false);

  // Get logged-in email from localStorage
  const loggedInCustomer = JSON.parse(localStorage.getItem("customer") || "{}");

  useEffect(() => {
    if (loggedInCustomer?.email) {
      axios.get(`http://localhost:5000/api/customers/${loggedInCustomer.email}`)
        .then((res) => setCustomer(res.data))
        .catch((err) => console.error(err));
    }
  }, [loggedInCustomer]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/api/customers/${loggedInCustomer.email}`, customer)
      .then((res) => {
        setCustomer(res.data);
        localStorage.setItem("customer", JSON.stringify(res.data)); // update localStorage
        setEditMode(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {editMode ? (
        <>
          <input type="text" name="fullName" value={customer.fullName || ""} onChange={handleChange} />
          <input type="email" name="email" value={customer.email || ""} disabled />
          <input type="text" name="contactNumber" value={customer.contactNumber || ""} onChange={handleChange} />
          <input type="text" name="address" value={customer.address || ""} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {customer.fullName}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Contact:</strong> {customer.contactNumber}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
}

export default CustomerProfile;
