import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateOrder() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    orderId: "",
    customerName: "",
    date: "",
    products: "",
    quantities: 1,
    total: "",
    orderstatus: "",
    deliveryMethod: "",
  });

  const statusOptions = ["Pending", "Packed", "Delivered", "Cancelled"];
  const deliveryOptions = ["Home Delivery", "Pickup"];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/orders/${id}`);
        const data = res.data.order;

        setInputs({
          orderId: data.orderId || "",
          customerName: data.customerName || "",
          date: data.date ? data.date.split("T")[0] : "",
          products: Array.isArray(data.products) ? data.products[0] : "",
          quantities: Array.isArray(data.quantities) ? data.quantities[0] : 1,
          total: data.total || "",
          orderstatus: data.orderstatus || "",
          deliveryMethod: data.deliveryMethod || "",
        });
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/orders/${id}`, {
        orderstatus: String(inputs.orderstatus),
        deliveryMethod: String(inputs.deliveryMethod),
      });
      navigate("/orders");
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    padding: "30px",
    maxWidth: "600px",
    margin: "40px auto",
    backgroundColor: "#fff",
  };

  const labelStyle = { fontWeight: 600, color: "#555" };
  const inputStyle = { borderRadius: "8px", padding: "10px", border: "1px solid #ccc" };
  const selectStyle = { borderRadius: "8px", padding: "10px", border: "1px solid #ccc" };
  const btnStyle = {
    borderRadius: "8px",
    padding: "12px",
    fontWeight: 600,
    fontSize: "16px",
    backgroundColor: "#0d6efd",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "50px" }}>
      <div style={cardStyle}>
        <h2 className="text-center text-primary mb-4" style={{ fontWeight: 700 }}>
          Update Order
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Read-only fields */}
          {["orderId", "customerName", "date", "products", "quantities", "total"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label" style={labelStyle}>
                {field === "orderId"
                  ? "Order ID"
                  : field === "customerName"
                  ? "Customer Name"
                  : field === "date"
                  ? "Date"
                  : field === "products"
                  ? "Products"
                  : field === "quantities"
                  ? "Quantity"
                  : "Total (Rs.)"}
              </label>
              <input
                type={field === "date" ? "date" : field === "quantities" || field === "total" ? "number" : "text"}
                name={field}
                value={inputs[field]}
                className="form-control"
                readOnly
                style={inputStyle}
              />
            </div>
          ))}

          {/* Editable fields */}
          <div className="mb-3">
            <label className="form-label" style={labelStyle}>Order Status</label>
            <select
              name="orderstatus"
              value={inputs.orderstatus}
              onChange={handleChange}
              className="form-select"
              required
              style={selectStyle}
            >
              <option value="">Select status</option>
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label" style={labelStyle}>Delivery Method</label>
            <select
              name="deliveryMethod"
              value={inputs.deliveryMethod}
              onChange={handleChange}
              className="form-select"
              required
              style={selectStyle}
            >
              <option value="">Select delivery method</option>
              {deliveryOptions.map((method, index) => (
                <option key={index} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={btnStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0b5ed7")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0d6efd")}
          >
            Update Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateOrder;
