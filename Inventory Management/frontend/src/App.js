import React, { useState, useEffect } from "react";
import { Routes ,Route} from 'react-router-dom';
import './App.css';
import Dashboard from './Components/Dashboard/Dashboard';
import AddInventory from "./Components/AddInventory/AddInventory";
import Inventories from "./Components/Inventories/Inventories";
import ProductionRequests from "./Components/ProductionRequests/ProductionRequests";
import BatchTracking from "./Components/Batch Tracking/BatchTracking";
import ExpiryTracking from "./Components/Expiry Tracking/ExpiryTracking";
import Layout from "./Components/Layout/Layout";
import UpdateInventory from "./Components/UpdateInventory/UpdateInventory";

function App() {
  const [profilePic, setProfilePic] = useState("/profile.jpg");

  // Load from localStorage on first render
  useEffect(() => {
    const savedPic = localStorage.getItem("profilePic");
    if (savedPic) setProfilePic(savedPic);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><Dashboard /></Layout>} />
      <Route path="/Dashboard" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><Dashboard /></Layout>} />
      <Route path="/AddInventoryPage" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><AddInventory /></Layout>} />
      <Route path="/InventoriesPage" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><Inventories /></Layout>} />
      <Route path="/InventoriesPage/:id" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><UpdateInventory /></Layout>} />
      <Route path="/ProductionRequestsPage" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><ProductionRequests /></Layout>} />
      <Route path="/BatchTrackingPagePage" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><BatchTracking /></Layout>} />
      <Route path="/ExpiryTrackingPage" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><ExpiryTracking /></Layout>} />
    </Routes>
  );
}

export default App;
