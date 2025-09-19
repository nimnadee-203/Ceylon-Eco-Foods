import React, { useEffect, useState } from "react";
import "./MyOrders.css";

function MyOrders() {
  // Get logged-in user from localStorage
  const [customer] = useState(
    JSON.parse(localStorage.getItem("customer")) || null
  );

  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch orders for this customer
  useEffect(() => {
    if (customer?.email) {
      fetch(`http://localhost:5000/orders?customerEmail=${customer.email}`)
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [customer]);

  const toggleOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (orders.length === 0) {
    return (
      <div className="container mt-5">
        <h3>No orders placed yet.</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="card mb-3 shadow-sm order-card">
          <div
            className="order-header d-flex justify-content-between align-items-center p-3"
            onClick={() => toggleOrder(order._id)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <strong>Order ID:</strong> {order.orderId} &nbsp;|&nbsp;{" "}
              <strong>Date:</strong>{" "}
              {new Date(order.date).toLocaleDateString()}
            </div>
            <div className="badge bg-primary">
              Total: Rs. {Number(order.total).toFixed(2)}
            </div>
          </div>

          {expandedOrderId === order._id && (
            <div className="order-details p-3 border-top">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between mb-2"
                >
                  <div>
                    {product} x {order.quantities[index]}
                  </div>
                  <div>Rs. {(order.total / order.products.length).toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
