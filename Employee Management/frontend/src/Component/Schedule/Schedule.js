import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Schedule({ schedule, onDelete }) {
  if (!schedule) return <p>No schedule data</p>;

  const { _id, employeeNames, date, startTime, endTime, shiftType } = schedule;
  // employeeNames: array of employee names

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/schedules/${_id}`);
      if (onDelete) onDelete(_id); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
      <p><b>Employees:</b> {employeeNames.join(", ")}</p>
      <p><b>Date:</b> {new Date(date).toLocaleDateString()}</p>
      <p><b>Start:</b> {startTime}</p>
      <p><b>End:</b> {endTime}</p>
      <p><b>Shift:</b> {shiftType}</p>
      <Link to={`/updateschedule/${_id}`}>Update</Link>
      <button onClick={deleteHandler} style={{ marginLeft: "10px" }}>Delete</button>
    </div>
  );
}

export default Schedule;
