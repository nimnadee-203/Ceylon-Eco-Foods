import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Target({ target, onDelete }) {
  if (!target) return <p>No target data</p>;

  const { _id, targetDate, productName, targetQuantity, achievedQuantity, status, employees, remarks } = target; // <-- employees array

  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/daily-targets/${_id}`);
      if (onDelete) onDelete(_id);
      navigate("/targetdetails");
    } catch (err) {
      console.error("Error deleting target:", err);
    }
  };

  return (
    <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
      <h3>Target Details</h3>
      <p><b>Target ID:</b> {_id}</p>
      <p><b>Date:</b> {targetDate}</p>
      <p><b>Product:</b> {productName}</p>
      <p><b>Target Quantity:</b> {targetQuantity}</p>
      <p><b>Achieved Quantity:</b> {achievedQuantity}</p>
      <p><b>Status:</b> {status}</p>
      <p><b>Employees:</b> {employees && employees.length > 0 ? employees.join(", ") : "No employees selected"}</p> {/* <-- multiple employees */}
      <p><b>Remarks:</b> {remarks}</p>

      <Link to={`/updatetarget/${_id}`} style={{ marginRight: "10px" }}>Update</Link>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
}

export default Target;
