import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateSchedule() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await axios.get(`http://localhost:5000/schedules/${id}`);
      const sched = res.data.schedule || res.data;
      setInputs({
        employee: sched.employee || [],
        task: sched.task || "",
        date: sched.date.split("T")[0],
        startTime: sched.startTime,
        endTime: sched.endTime,
        shiftType: sched.shiftType,
      });
      setLoading(false);
    };

    const fetchEmployees = async () => {
      const res = await axios.get("http://localhost:5000/employees");
      setEmployees(res.data.employees || res.data);
    };

    fetchSchedule();
    fetchEmployees();
  }, [id]);

  const handleChange = (e) => {
    const { name, options, value } = e.target;
    if (name === "employee") {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setInputs({ ...inputs, employee: selected });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/schedules/${id}`, inputs);
    navigate("/scheduledetails");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Update Schedule</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Employees:</label>
          <select
            name="employee"
            multiple
            value={inputs.employee}
            onChange={handleChange}
            className="form-select"
            required
          >
            {employees.map((emp) => (
              <option key={emp._id} value={emp.email}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Task:</label>
          <input
            type="text"
            name="task"
            value={inputs.task}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Enter task description"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input
            type="date"
            name="date"
            value={inputs.date}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={inputs.startTime}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <label className="form-label">End Time:</label>
            <input
              type="time"
              name="endTime"
              value={inputs.endTime}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Shift Type:</label>
          <select
            name="shiftType"
            value={inputs.shiftType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Schedule
        </button>
      </form>
    </div>
  );
}

export default UpdateSchedule;
