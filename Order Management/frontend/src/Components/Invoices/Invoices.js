import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Invoices() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const generateInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Ceylon Eco Foods", 14, 20);
    doc.setFontSize(12);
    doc.text("Invoice", 14, 28);
    doc.text("Invoice No: INV-" + order.orderId, 14, 36);
    doc.text("Date: " + new Date(order.date).toLocaleDateString(), 14, 44);

    doc.text("Bill To:", 140, 28);
    doc.text(String(order.customerName), 140, 36);
    if (order.customerEmail) doc.text(String(order.customerEmail), 140, 44);

const tableRows = (order.products || []).map((product, idx) => {
  const quantity = Array.isArray(order.quantities) ? (order.quantities[idx] || 1) : 1;
  const price = Array.isArray(order.prices) ? (order.prices[idx] || 0) : 0;

  return [String(product), quantity, "LKR " + Number(price).toFixed(2)];
});

    autoTable(doc, {
      startY: 54,
      head: [["Item", "Qty", "Price"]],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [76, 175, 80] }
    });

    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : 54;
    const totalY = finalY + 10;
    doc.text("Delivery: " + (order.deliveryMethod || "N/A"), 14, totalY);
    doc.text("Status: " + order.orderstatus, 14, totalY + 8);
    doc.setFontSize(14);
    doc.text("Total: LKR " + Number(order.total).toFixed(2), 140, totalY);
    doc.save("Invoice_INV-" + order.orderId + ".pdf");
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Invoices</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Order ID</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Customer</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Date</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Items</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Total (LKR)</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Status</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} style={{ textAlign: "center" }}>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{o.orderId}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{o.customerName}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{new Date(o.date).toLocaleDateString()}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{Array.isArray(o.products) ? o.products.join(", ") : o.products}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{Number(o.total).toFixed(2)}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{o.orderstatus}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>
                <button className="btn btn-primary" onClick={() => generateInvoice(o)}>Generate Invoice</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Invoices;


