import React, { useState, useEffect } from "react";
import { Routes ,Route} from 'react-router-dom';
import './App.css';
import Layout from "./Components/Layout/Layout"; 
import Dashboard from "./Components/Dashboard/Dashboard";
import ProductionStocks from "./Components/ProductionStocks/ProductionStocks";
import UpdateProductionStock from "./Components/UpdateProductionStock/UpdateProductionStock";
import SendMaterialRequest from "./Components/SendMaterialRequest/SendMaterialRequest";



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
      <Route path="/SendMaterialRequestPage" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><SendMaterialRequest /></Layout>} />
      <Route path="/ProductionStocksPage" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><ProductionStocks /></Layout>} />
      <Route path="/ProductionStocksPage/:id" element={<Layout profilePic={profilePic} setProfilePic={setProfilePic}><UpdateProductionStock /></Layout>} />
      
    </Routes>
  );
}


export default App;
