import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import './App.css';

// Pages / Components
import LandingPage from './Components/LandingPage/LandingPage';
import Home from './Components/Home/Home';
import Sidebar from './Components/Sidebar/Sidebar';
import Orders from './Components/OrderDetails/Orders';

import UpdateOrder from "./Components/UpdateOrder/UpdateOrder";
import Products from './Components/ProductDetails/Products';
import AddProduct from './Components/AddProduct/AddProduct';
import UpdateProduct from './Components/UpdateProduct/UpdateProduct';
import Invoices from './Components/Invoices/Invoices';
import LoyaltyList from './Components/Loyalty/LoyaltyList';

// Customer
import CustomerSignUp from "./Components/CustomerSignUp/CustomerSignUp";
import CustomerLogin from "./Components/CustomerLogin/CustomerLogin";
import CustomerDashboard from "./Components/CustomerDashboard/CustomerDashboard";
import Cart from './Components/CustomerDashboard/Cart';
import WithCustomerSidebar from "./Components/CustomerSidebar/WithCustomerSidebar";
import MyOrders from "./Components/MyOrders/MyOrders";
import CustomerProfile from "./Components/CustomerProfile/CustomerProfile";
// Admin
import AdminSignUp from './Components/AdminSignUp/AdminSignUp';
import AdminLogin from './Components/AdminLogin/AdminLogin';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';

// Navbar
import AdminNavbar from './Components/Navbar/AdminNavbar';
import CustomerNavbar from './Components/Navbar/CustomerNavbar';

// Sidebar wrapper
function WithSidebar({ children }) {
  return (
    <div className="sidebar-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("role")); // "admin" or "customer"
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem("adminLoggedIn") === "true");
  const [customerLoggedIn, setCustomerLoggedIn] = useState(localStorage.getItem("customerLoggedIn") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
      setAdminLoggedIn(localStorage.getItem("adminLoggedIn") === "true");
      setCustomerLoggedIn(localStorage.getItem("customerLoggedIn") === "true");
    };
    
    // Listen for storage changes (cross-tab)
    window.addEventListener("storage", handleStorageChange);
    
    // Listen for custom login/logout events
    window.addEventListener("loginStatusChange", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStatusChange", handleStorageChange);
    };
  }, []);

  const showNavbar = location.pathname !== "/";
  
  // Determine which navbar to show
  let navbar = null;
  if (showNavbar) {
    if (adminLoggedIn) {
      navbar = <AdminNavbar />;
    } else if (customerLoggedIn) {
      navbar = <CustomerNavbar />;
    } else if (role === "admin") {
      navbar = <AdminNavbar />;
    } else if (role === "customer") {
      navbar = <CustomerNavbar />;
    } else {
      // Default to customer navbar for public pages
      navbar = <CustomerNavbar />;
    }
  }

  return (
    <div className="app-container">
      {navbar}

      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Home page (role selection if not logged in) */}
        <Route path="/home" element={
          role === "admin" ? <Navigate to="/admin-dashboard" /> :
          role === "customer" ? <Navigate to="/customer-dashboard" /> :
          <Home />
        } />

       {/* Customer Routes */}
<Route path="/regi" element={<CustomerSignUp />} />
<Route path="/log" element={<CustomerLogin />} />

<Route
  path="/customer-dashboard"
  element={
    localStorage.getItem("customerLoggedIn") === "true"
      ? <WithCustomerSidebar><CustomerDashboard /></WithCustomerSidebar>
      : <Navigate to="/" />
  }
/>

<Route
  path="/cart"
  element={
    localStorage.getItem("customerLoggedIn") === "true"
      ? <WithCustomerSidebar><Cart /></WithCustomerSidebar>
      : <Navigate to="/" />
  }
/>

<Route
  path="/my-orders"
  element={
    localStorage.getItem("customerLoggedIn") === "true"
      ? <WithCustomerSidebar><MyOrders /></WithCustomerSidebar>
      : <Navigate to="/" />
  }
/>
<Route path="/profile" element={<CustomerProfile />} />        

        {/* Admin */}
        <Route path="/AdminSignUp" element={<AdminSignUp />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            localStorage.getItem("adminLoggedIn") === "true" 
              ? <WithSidebar><AdminDashboard /></WithSidebar> 
              : <Navigate to="/" />
          }
        />

        {/* Orders (Admin only) */}
        <Route
          path="/orders"
          element={
            localStorage.getItem("adminLoggedIn") === "true"
              ? <WithSidebar><Orders /></WithSidebar>
              : <Navigate to="/" />
          }
        />
        <Route
          path="/orders/:id"
          element={
            localStorage.getItem("adminLoggedIn") === "true"
              ? <WithSidebar><UpdateOrder /></WithSidebar>
              : <Navigate to="/" />
          }
        />

        {/* Products */}
        <Route path="/products" element={<WithSidebar><Products /></WithSidebar>} />
        <Route path="/add-product" element={<WithSidebar><AddProduct /></WithSidebar>} />
        <Route path="/update-product/:id" element={<WithSidebar><UpdateProduct /></WithSidebar>} />

        {/* Invoices (Admin only) */}
        <Route
          path="/invoice"
          element={
            localStorage.getItem("adminLoggedIn") === "true"
              ? <WithSidebar><Invoices /></WithSidebar>
              : <Navigate to="/" />
          }
        />

        {/* Loyalty (Admin only) */}
        <Route
          path="/loyalty"
          element={
            localStorage.getItem("adminLoggedIn") === "true"
              ? <WithSidebar><LoyaltyList /></WithSidebar>
              : <Navigate to="/" />
          }
        />

      </Routes>
    </div>
  );
}

export default App;
