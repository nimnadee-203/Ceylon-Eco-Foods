import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddTarget() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    targetDate: "",
    productName: "",
    targetQuantity: "",
    achievedQuantity: "",
    status: "",
    employee: [],
    remarks: "",
  });

  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/employees");
        setEmployees(res.data.employees || res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "employee") {
      setInputs(prev => ({
        ...prev,
        employee: Array.from(selectedOptions, option => option.value)
      }));
    } else {
      setInputs(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Date validation
    if (!inputs.targetDate) newErrors.targetDate = "Date is required";
    else if (new Date(inputs.targetDate) < new Date().setHours(0, 0, 0, 0))
      newErrors.targetDate = "Date cannot be in the past";

    // Product name validation
    if (!inputs.productName.trim()) newErrors.productName = "Product Name is required";
    else if (inputs.productName.trim().length < 3)
      newErrors.productName = "Product Name must be at least 3 characters";

    // Target quantity
    if (!inputs.targetQuantity) newErrors.targetQuantity = "Target Quantity is required";
    else if (inputs.targetQuantity <= 0) newErrors.targetQuantity = "Target Quantity must be greater than 0";

    // Achieved quantity
    if (inputs.achievedQuantity < 0) newErrors.achievedQuantity = "Achieved Quantity cannot be negative";
    else if (inputs.achievedQuantity > inputs.targetQuantity)
      newErrors.achievedQuantity = "Achieved Quantity cannot exceed Target Quantity";

    // Status
    if (!inputs.status) newErrors.status = "Status is required";

    // Employee
    if (!inputs.employee.length) newErrors.employee = "Select at least one employee";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/daily-targets", inputs);
      alert("Target added successfully!");
      navigate("/targetdetails");
    } catch (err) {
      console.error(err);
      alert("Error adding target");
    }
  };

  return (
    <div className="container-fluid">
      <Nav />
      <div className="container mt-4">
        <h1 className="mb-4 text-primary fw-bold">Add Target</h1>
        <form onSubmit={handleSubmit} className="row g-3" noValidate>

          <div className="col-md-6">
            <label>Date:</label>
            <input
              type="date"
              name="targetDate"
              value={inputs.targetDate}
              onChange={handleChange}
              className={`form-control ${errors.targetDate ? "is-invalid" : ""}`}
            />
            {errors.targetDate && <div className="invalid-feedback">{errors.targetDate}</div>}
          </div>

          <div className="col-md-6">
            <label>Product Name:</label>
            <input
              type="text"
              name="productName"
              value={inputs.productName}
              onChange={handleChange}
              className={`form-control ${errors.productName ? "is-invalid" : ""}`}
            />
            {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
          </div>

          <div className="col-md-6">
            <label>Target Quantity:</label>
            <input
              type="number"
              name="targetQuantity"
              value={inputs.targetQuantity}
              onChange={handleChange}
              className={`form-control ${errors.targetQuantity ? "is-invalid" : ""}`}
            />
            {errors.targetQuantity && <div className="invalid-feedback">{errors.targetQuantity}</div>}
          </div>

          <div className="col-md-6">
            <label>Achieved Quantity:</label>
            <input
              type="number"
              name="achievedQuantity"
              value={inputs.achievedQuantity}
              onChange={handleChange}
              className={`form-control ${errors.achievedQuantity ? "is-invalid" : ""}`}
            />
            {errors.achievedQuantity && <div className="invalid-feedback">{errors.achievedQuantity}</div>}
          </div>

          <div className="col-md-6">
            <label>Status:</label>
            <select
              name="status"
              value={inputs.status}
              onChange={handleChange}
              className={`form-select ${errors.status ? "is-invalid" : ""}`}
            >
              <option value="">Select</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && <div className="invalid-feedback">{errors.status}</div>}
          </div>

          <div className="col-md-6">
            <label>Employee:</label>
            <select
              name="employee"
              value={inputs.employee}
              onChange={handleChange}
              className={`form-select ${errors.employee ? "is-invalid" : ""}`}
              multiple
            >
              {employees.map(emp => (
                <option key={emp._id} value={emp.email}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
            {errors.employee && <div className="invalid-feedback">{errors.employee}</div>}
          </div>

          <div className="col-12">
            <label>Remarks:</label>
            <textarea
              name="remarks"
              value={inputs.remarks}
              onChange={handleChange}
              className="form-control"
              rows="3"
            ></textarea>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success me-2">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/targetdetails")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTarget;
