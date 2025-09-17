import React from "react";
import { Link } from "react-router-dom";

function ScheduleNav() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Ceylon Eco Foods - Schedules</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ margin: "10px 0" }}>
          <Link to="/schedulehome">Dashboard</Link>
        </li>
        <li style={{ margin: "10px 0" }}>
          <Link to="/scheduledetails">Schedule List</Link>
        </li>
        <li style={{ margin: "10px 0" }}>
          <Link to="/addschedule">Add Schedule</Link>
        </li>
      </ul>
    </div>
  );
}

export default ScheduleNav;
