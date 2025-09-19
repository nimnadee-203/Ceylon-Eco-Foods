import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Product({ product, onDelete }) {
  const { _id, productName, category, description, price, stock, units, status, image } = product || {};

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/products/${_id}`);
      if (onDelete) onDelete(_id);
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        maxWidth: "300px",
        width: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      className="product-card"
    >
      <h3>{productName}</h3>
      <p><strong>Product ID:</strong> {_id}</p>
      <p>Category: {category}</p>
      <p>Description: {description}</p>
      <p>Price: Rs. {Number(price).toFixed(2)}</p>
      <p>Stock: {stock} {units}</p>
      <p style={{ color: status === "Available" ? "#4CAF50" : "#FF9800", fontWeight: "bold" }}>
        Status: {status}
      </p>
      {image && (
        <div style={{ margin: "10px 0" }}>
          <img src={`http://localhost:5000/${image}`} alt={productName} style={{ maxWidth: "150px", borderRadius: "4px" }} />
        </div>
      )}

      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <Link
          to={`/update-product/${_id}`}
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
        >Delete</button>
      </div>
    </div>
  );
}

export default Product;
