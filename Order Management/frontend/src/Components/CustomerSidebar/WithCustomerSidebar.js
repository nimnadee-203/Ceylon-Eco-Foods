// WithCustomerSidebar.jsx
import React from "react";
import CustomerSidebar from "./CustomerSidebar";

function WithCustomerSidebar({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <CustomerSidebar />
      <div style={{ flex: 1, padding: "10px" }}>
        {children}
      </div>
    </div>
  );
}

export default WithCustomerSidebar;
