import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddEmployee() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!inputs.name.trim()) newErrors.name = "Name is required";

    // Email validation
    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = "Email is invalid";
    }

    // Position validation
    if (!inputs.position.trim()) newErrors.position = "Position is required";

    // Department validation
    if (!inputs.department.trim()) newErrors.department = "Department is required";

    // Phone validation
    if (!inputs.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(inputs.phone)) {
      newErrors.phone = "Phone number must be 10-15 digits";
    }

    // Password validation
    if (!inputs.password.trim()) {
      newErrors.password = "Password is required";
    } else if (inputs.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/employees", inputs);
      alert("Employee added successfully!");
      navigate("/employeedetails");
    } catch (err) {
      console.error(err);
      alert("Error adding employee");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary fw-bold">Add Employee</h1>
      <form onSubmit={handleSubmit} noValidate>
        {/** Name */}
        <div className="mb-3">
          <input
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/** Email */}
        <div className="mb-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/** Position */}
        <div className="mb-3">
          <input
            name="position"
            placeholder="Position"
            value={inputs.position}
            onChange={handleChange}
            className={`form-control ${errors.position ? "is-invalid" : ""}`}
          />
          {errors.position && <div className="invalid-feedback">{errors.position}</div>}
        </div>

        {/** Department */}
        <div className="mb-3">
          <input
            name="department"
            placeholder="Department"
            value={inputs.department}
            onChange={handleChange}
            className={`form-control ${errors.department ? "is-invalid" : ""}`}
          />
          {errors.department && <div className="invalid-feedback">{errors.department}</div>}
        </div>

        {/** Phone */}
        <div className="mb-3">
          <input
            name="phone"
            placeholder="Phone"
            value={inputs.phone}
            onChange={handleChange}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        {/** Password */}
        <div className="mb-3">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Add Employee
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => navigate("/employeedetails")}
        >
          View Employees
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
