import React, { useState, useEffect } from "react";
import axios from "axios";
import Order from "../Order/Order"; // keeps your existing update/delete logic
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/orders";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(URL);
        const fetchedOrders = res.data.orders || [];
        const sortedOrders = [...fetchedOrders].sort((a, b) =>
          a.orderId > b.orderId ? 1 : -1
        );
        setOrders(sortedOrders);
        setAllOrders(sortedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = (id) => {
    setOrders((prev) => prev.filter((order) => order._id !== id));
    setAllOrders((prev) => prev.filter((order) => order._id !== id));
  };

  const downloadPDF = () => {
    if (!window.confirm("Do you want to download the Orders Report as a PDF?")) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Orders Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = [
      "Order ID",
      "Customer",
      "Date",
      "Products",
      "Quantity",
      "Total (Rs.)",
      "Status",
    ];
    const tableRows = [];

    orders.forEach((order) => {
      const products = Array.isArray(order.products) ? order.products.join(", ") : order.products;
      const quantities = Array.isArray(order.quantities) ? order.quantities.join(", ") : order.quantities;

      tableRows.push([
        order.orderId,
        order.customerName,
        new Date(order.date).toLocaleDateString(),
        products,
        quantities,
        `Rs. ${Number(order.total).toFixed(2)}`,
        order.orderstatus,
      ]);
    });

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [76, 175, 80] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`Orders_Report_${new Date().toLocaleDateString()}.pdf`);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setOrders(allOrders);
      setNoResults(false);
      return;
    }

    let filteredOrders = [];
    if (searchField === "orderId") {
      filteredOrders = allOrders.filter((order) =>
        order.orderId?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      filteredOrders = allOrders.filter((order) =>
        Object.values(order).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setOrders(filteredOrders);
    setNoResults(filteredOrders.length === 0);
  }, [searchQuery, searchField, allOrders]);

  const handleSendReport = () => {
    const phoneNumber = "94702363423";
    const message = `Selected Order Report`;
    const WhatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(WhatsappUrl, "_blank");
  };

  // Modern reusable button style
  const actionBtnStyle = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "14px",
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ margin: 0, color: "#333" }}>Orders</h1>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}
          >
            <option value="all">All Fields</option>
            <option value="orderId">Order ID</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${searchField === "orderId" ? "Order ID" : "anything"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", flex: 1 }}
          />

          <button
            onClick={downloadPDF}
            style={{ ...actionBtnStyle, backgroundColor: "#1d4ed8", color: "white" }}
            onMouseOver={e => Object.assign(e.currentTarget.style, { backgroundColor: "#2563eb", transform: "scale(1.05)" })}
            onMouseOut={e => Object.assign(e.currentTarget.style, { backgroundColor: "#1d4ed8", transform: "scale(1)" })}
          >
            Download PDF
          </button>

          <button
            onClick={handleSendReport}
            style={{ ...actionBtnStyle, backgroundColor: "#25d366", color: "white" }}
            onMouseOver={e => Object.assign(e.currentTarget.style, { backgroundColor: "#1ebe5d", transform: "scale(1.05)" })}
            onMouseOut={e => Object.assign(e.currentTarget.style, { backgroundColor: "#25d366", transform: "scale(1)" })}
          >
            Send WhatsApp
          </button>
        </div>
      </div>

      {/* Table */}
      {noResults ? (
        <p style={{ color: "#777" }}>No orders found for "{searchQuery}"</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead style={{ background: "#4CAF50", color: "#fff", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "12px" }}>Order ID</th>
                <th style={{ padding: "12px" }}>Customer</th>
                <th style={{ padding: "12px" }}>Date</th>
                <th style={{ padding: "12px" }}>Products</th>
                <th style={{ padding: "12px" }}>Quantity</th>
                <th style={{ padding: "12px" }}>Total (Rs.)</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "10px" }}>{order.orderId}</td>
                  <td style={{ padding: "10px" }}>{order.customerName}</td>
                  <td style={{ padding: "10px" }}>{new Date(order.date).toLocaleDateString()}</td>
                  <td style={{ padding: "10px" }}>{Array.isArray(order.products) ? order.products.join(", ") : order.products}</td>
                  <td style={{ padding: "10px" }}>{Array.isArray(order.quantities) ? order.quantities.join(", ") : order.quantities}</td>
                  <td style={{ padding: "10px" }}>Rs. {Number(order.total).toFixed(2)}</td>
                  <td style={{ padding: "10px", fontWeight: "bold", color: order.orderstatus === "Delivered" ? "#4CAF50" : "#FF9800" }}>
                    {order.orderstatus}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <Order order={order} onDelete={handleDelete} displayOnly={true} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;
