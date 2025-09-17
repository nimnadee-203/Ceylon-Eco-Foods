import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddSchedule() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    employee: [],
    task: "",
    date: "",
    startTime: "",
    endTime: "",
    shiftType: "Morning",
  });
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.get("http://localhost:5000/employees");
      setEmployees(res.data.employees || res.data);
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "employee") {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setInputs({ ...inputs, employee: selected });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Employee validation
    if (!inputs.employee.length) newErrors.employee = "Select at least one employee";

    // Task validation
    if (!inputs.task.trim()) newErrors.task = "Task is required";
    else if (inputs.task.trim().length < 5) newErrors.task = "Task description must be at least 5 characters";

    // Date validation
    if (!inputs.date) newErrors.date = "Date is required";
    else if (new Date(inputs.date) < new Date().setHours(0, 0, 0, 0))
      newErrors.date = "Date cannot be in the past";

    // Time validation
    if (!inputs.startTime) newErrors.startTime = "Start time is required";
    if (!inputs.endTime) newErrors.endTime = "End time is required";
    if (inputs.startTime && inputs.endTime && inputs.startTime >= inputs.endTime)
      newErrors.endTime = "End time must be after start time";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/schedules", inputs);
      alert("Schedule added successfully!");
      navigate("/scheduledetails");
    } catch (err) {
      console.error(err);
      alert("Error adding schedule");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary fw-bold">Add Schedule</h1>
      <form onSubmit={handleSubmit} noValidate>
        {/** Employee Selection */}
        <div className="mb-3">
          <label className="form-label">Select Employees:</label>
          <select
            className={`form-select ${errors.employee ? "is-invalid" : ""}`}
            name="employee"
            multiple
            value={inputs.employee}
            onChange={handleChange}
          >
            {employees.map((emp) => (
              <option key={emp._id} value={emp.email}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
          {errors.employee && <div className="invalid-feedback">{errors.employee}</div>}
        </div>

        {/** Task */}
        <div className="mb-3">
          <label className="form-label">Task:</label>
          <input
            type="text"
            className={`form-control ${errors.task ? "is-invalid" : ""}`}
            name="task"
            value={inputs.task}
            onChange={handleChange}
            placeholder="Enter task description"
          />
          {errors.task && <div className="invalid-feedback">{errors.task}</div>}
        </div>

        {/** Date */}
        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input
            type="date"
            className={`form-control ${errors.date ? "is-invalid" : ""}`}
            name="date"
            value={inputs.date}
            onChange={handleChange}
          />
          {errors.date && <div className="invalid-feedback">{errors.date}</div>}
        </div>

        {/** Start & End Time */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Start Time:</label>
            <input
              type="time"
              className={`form-control ${errors.startTime ? "is-invalid" : ""}`}
              name="startTime"
              value={inputs.startTime}
              onChange={handleChange}
            />
            {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
          </div>
          <div className="col">
            <label className="form-label">End Time:</label>
            <input
              type="time"
              className={`form-control ${errors.endTime ? "is-invalid" : ""}`}
              name="endTime"
              value={inputs.endTime}
              onChange={handleChange}
            />
            {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
          </div>
        </div>

        {/** Shift Type */}
        <div className="mb-3">
          <label className="form-label">Shift Type:</label>
          <select
            className="form-select"
            name="shiftType"
            value={inputs.shiftType}
            onChange={handleChange}
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Schedule
        </button>
      </form>
    </div>
  );
}

export default AddSchedule;
