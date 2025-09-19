import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Order({ order, onDelete, displayOnly }) {
  const { _id, orderId, customerName, date, products, quantities, total, orderstatus } = order || {};

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:5000/orders/${_id}`);
      if (onDelete) onDelete(_id);
    } catch (err) {
      console.error("Error deleting order:", err.response?.data || err);
    }
  };

  // If displayOnly is true, render only action buttons (for table)
  if (displayOnly) {
    return (
      <div style={{ display: "flex", gap: "10px" }}>
        <Link 
          to={`/orders/${_id}`}
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: "6px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          Update
        </Link>
        <button
          type="button"
          onClick={deleteHandler}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            padding: "6px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Delete
        </button>
      </div>
    );
  }

  // Default card layout
  return (
    <div style={{ 
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <h3>Order ID: {orderId}</h3>
      <p><strong>Order Tracking ID:</strong> {_id}</p>
      <p>Customer Name: {customerName}</p>
      <p>Date: {date ? new Date(date).toLocaleDateString() : ""}</p>
      <p>
        Products: {Array.isArray(products) 
          ? products.map((p, i) => `${p} (Qty: ${quantities?.[i] || 1})`).join(", ") 
          : products}
      </p>
      <p>Total: Rs. {Number(total).toFixed(2)}</p>
      <p style={{ color: orderstatus === "Delivered" ? "#4CAF50" : "#FF9800", fontWeight: "bold" }}>
        Status: {orderstatus}
      </p>

      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <Link 
          to={`/orders/${_id}`}
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            textDecoration: "none"
          }}
        >
          Update
        </Link>
        <button
          type="button"
          onClick={deleteHandler}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Order;
