import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/employees/${id}`);
        setInputs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!inputs.name.trim()) newErrors.name = "Name is required";
    if (!inputs.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(inputs.email)) newErrors.email = "Email is invalid";
    if (!inputs.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10,15}$/.test(inputs.phone)) newErrors.phone = "Phone must be 10-15 digits";
    if (!inputs.position.trim()) newErrors.position = "Position is required";
    if (!inputs.department.trim()) newErrors.department = "Department is required";
    if (inputs.password && inputs.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const updateData = {};
      Object.keys(inputs).forEach((key) => {
        if (inputs[key] && inputs[key].trim() !== "") {
          updateData[key] = inputs[key].trim();
        }
      });

      await axios.put(`http://localhost:5000/employees/${id}`, updateData);
      alert("Employee updated successfully!");
      navigate("/employeedetails");
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage = err.response?.data?.message || "Error updating employee";
      alert(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h2 className="card-title mb-4 text-center text-primary">Update Employee</h2>
          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                name="name"
                value={inputs.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                name="phone"
                value={inputs.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            {/* Position */}
            <div className="mb-3">
              <label className="form-label">Position</label>
              <input
                name="position"
                value={inputs.position}
                onChange={handleChange}
                className={`form-control ${errors.position ? "is-invalid" : ""}`}
              />
              {errors.position && <div className="invalid-feedback">{errors.position}</div>}
            </div>

            {/* Department */}
            <div className="mb-3">
              <label className="form-label">Department</label>
              <input
                name="department"
                value={inputs.department}
                onChange={handleChange}
                className={`form-control ${errors.department ? "is-invalid" : ""}`}
              />
              {errors.department && <div className="invalid-feedback">{errors.department}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password (Optional)</label>
              <input
                name="password"
                type="password"
                value={inputs.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">Update</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/employeedetails")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateEmployee;
