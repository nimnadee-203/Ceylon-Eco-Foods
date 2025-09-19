import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";
import Deliveries from "./Components/Deliveries";
import Vehicles from "./Components/Vehicles";
import Drivers from "./Components/Drivers";
import Maintenances from "./Components/Maintenances"; // Maintenance component
import RouteManagement from "./Components/Routes"; // Route Management component
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="App">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Deliveries */}
          <Route path="/deliveries" element={<Deliveries />} />

          {/* Vehicles */}
          <Route path="/vehicles" element={<Vehicles />} />

          {/* Drivers */}
          <Route path="/drivers" element={<Drivers />} />

          {/* Maintenances */}
          <Route path="/maintenance" element={<Maintenances />} />

          {/* Route Management */}
          <Route path="/routes" element={<RouteManagement />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
