import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Employee({ employee, onDelete }) {
  const navigate = useNavigate();
  if (!employee) return <p>No employee data</p>;

  const { _id, name, email, position, department, phone, password } = employee;

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/employees/${_id}`);
      if (onDelete) onDelete(_id);
    } catch (err) {
      console.error(err);
    }
  };

  const updateHandler = () => {
    navigate(`/updateemployee/${_id}`);
  };

  return (
    <div className="card shadow-sm mb-3 border-0">
      <div className="card-body">
        <h5 className="card-title text-primary fw-bold">{name}</h5>
        {position && <span className="badge bg-success mb-2">{position}</span>}
        <ul className="list-unstyled small mb-3">
          <li><strong>ID:</strong> {_id}</li>
          <li><strong>Email:</strong> {email}</li>
          <li><strong>Department:</strong> {department}</li>
          <li><strong>Phone:</strong> {phone}</li>
          <li><strong>Password:</strong> {password}</li>
        </ul>
      </div>
      <div className="card-footer bg-light d-flex justify-content-between">
        <button className="btn btn-sm btn-primary" onClick={updateHandler}>
          Update
        </button>
        <button className="btn btn-sm btn-danger" onClick={deleteHandler}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Employee;
