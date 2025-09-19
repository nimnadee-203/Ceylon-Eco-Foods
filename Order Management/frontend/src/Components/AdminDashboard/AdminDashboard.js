import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch orders and products for dashboard summary
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  // Compute stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderstatus === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.orderstatus === "Delivered").length;

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.status === "Available").length;
  const outOfStockProducts = products.filter((p) => p.status !== "Available").length;

  // Compute top-selling products
  const productSalesMap = {};
  orders.forEach((order) => {
    order.products?.forEach((productName, index) => {
      const qty = order.quantities?.[index] || 1;
      productSalesMap[productName] = (productSalesMap[productName] || 0) + qty;
    });
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5); // Top 5 products

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Manage orders, products, and view quick stats.</p>

      {/* Stats cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        <div
          onClick={() => navigate("/orders")}
          style={{
            flex: "1 1 200px",
            background: "#4CAF50",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <h2>{totalOrders}</h2>
          <p>Total Orders</p>
          <p>Pending: {pendingOrders} | Delivered: {deliveredOrders}</p>
        </div>

        <div
          onClick={() => navigate("/products")}
          style={{
            flex: "1 1 200px",
            background: "#2196F3",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <h2>{totalProducts}</h2>
          <p>Total Products</p>
          <p>Available: {availableProducts} | Out of Stock: {outOfStockProducts}</p>
        </div>
      </div>

      {/* Recent orders table */}
      <div style={{ marginTop: "40px" }}>
        <h3>Recent Orders</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Order ID</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Customer</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Total</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(-5).reverse().map((order) => (
              <tr key={order._id} style={{ textAlign: "center" }}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{order._id}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{order.customerName}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>Rs. {order.total}</td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    color: order.orderstatus === "Delivered" ? "#4CAF50" : "#FF9800",
                    fontWeight: "bold",
                  }}
                >
                  {order.orderstatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top selling products chart */}
      <div style={{ marginTop: "40px" }}>
        <h3>Top Selling Products</h3>
        {topProducts.length === 0 ? (
          <p>No sales data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
