import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";

function UpdateTarget() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/employees");
        setEmployees(res.data.employees || res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTarget = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/daily-targets/${id}`);
        const target = res.data.target || res.data;
        setInputs({
          targetDate: target.targetDate || "",
          productName: target.productName || "",
          targetQuantity: target.targetQuantity || "",
          achievedQuantity: target.achievedQuantity || "",
          status: target.status || "",
          employee: target.employee || [],
          remarks: target.remarks || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
    fetchTarget();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/daily-targets/${id}`, inputs);
      navigate("/targetdetails");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container mt-4"><Nav /><p>Loading target data...</p></div>;

  return (
    <div className="container-fluid">
      <Nav />
      <div className="container mt-4">
        <h1 className="mb-4">Update Target</h1>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Same form fields as AddTarget.js */}
          <div className="col-md-6">
            <label>Date:</label>
            <input type="date" name="targetDate" value={inputs.targetDate} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label>Product Name:</label>
            <input type="text" name="productName" value={inputs.productName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label>Target Quantity:</label>
            <input type="number" name="targetQuantity" value={inputs.targetQuantity} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label>Achieved Quantity:</label>
            <input type="number" name="achievedQuantity" value={inputs.achievedQuantity} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label>Status:</label>
            <select name="status" value={inputs.status} onChange={handleChange} className="form-select" required>
              <option value="">Select</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Employee:</label>
            <select name="employee" value={inputs.employee} onChange={handleChange} className="form-select" multiple required>
              {employees.map(emp => (
                <option key={emp._id} value={emp.email}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label>Remarks:</label>
            <textarea name="remarks" value={inputs.remarks} onChange={handleChange} className="form-control" rows="3"></textarea>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary me-2">Update</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/targetdetails")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTarget;
