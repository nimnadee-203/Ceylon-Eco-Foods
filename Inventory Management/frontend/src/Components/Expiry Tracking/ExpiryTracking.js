import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExpiryTracking = () => {
  const [inventories, setInventories] = useState([]);
  const [batchStatus, setBatchStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await axios.get("http://localhost:5000/inventories");
        const statusRes = await axios.get("http://localhost:5000/batchStatus");

        setInventories(invRes.data.inventories || []);

        // Map batchId -> status
        const statusMap = {};
        (statusRes.data.statuses || []).forEach(s => {
          statusMap[s.batchId] = s;
        });
        setBatchStatus(statusMap);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered items under 30 days & not deleted & remaining quantity > 0
  const filteredItems = inventories
    .filter(item => {
      const status = batchStatus[item._id] || { usedQuantity: 0, isDeleted: false };
      const remainingQty = item.Quantity - status.usedQuantity;
      if (status.isDeleted || remainingQty <= 0) return false;

      const expiry = item.ExpiryDate ? new Date(item.ExpiryDate) : null;
      if (!expiry) return false;

      const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      if (daysLeft > 30 || daysLeft < 0) return false;

      const query = searchQuery.toLowerCase();
      return (
        item.productName.toLowerCase().includes(query) ||
        String(item.BatchNumber).includes(query) ||
        item.Supplier.toLowerCase().includes(query) ||
        (item.ExpiryDate && new Date(item.ExpiryDate).toLocaleDateString().includes(query))
      );
    })
    .sort((a, b) => {
      const daysA = Math.ceil((new Date(a.ExpiryDate) - today) / (1000 * 60 * 60 * 24));
      const daysB = Math.ceil((new Date(b.ExpiryDate) - today) / (1000 * 60 * 60 * 24));
      return daysA - daysB;
    });

  // PDF download
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Expiring Materials (Under 30 Days)", 14, 15);

    autoTable(doc, {
      head: [["Product", "Batch", "Remaining Qty", "Unit", "Supplier", "Expiry Date", "Days Left", "Suggested Action"]],
      body: filteredItems.map(item => {
        const status = batchStatus[item._id] || { usedQuantity: 0 };
        const remainingQty = item.Quantity - status.usedQuantity;
        const expiry = new Date(item.ExpiryDate);
        const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        let action = "Monitor closely";
        if (daysLeft <= 5) action = "Use immediately";
        else if (daysLeft <= 8) action = "Prioritize usage";

        return [
          item.productName,
          item.BatchNumber,
          remainingQty,
          item.Unit || "-",
          item.Supplier,
          expiry.toLocaleDateString(),
          daysLeft,
          action
        ];
      }),
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }
    });

    doc.save("Expiring_Materials.pdf");
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading inventories...</p>;

  return (
    <div style={{ margin: "50px auto", padding: "20px", maxWidth: "1000px" }}>
      <h2>📅 Expiry Tracking</h2>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by product, batch, supplier, expiry..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
      </div>

      <button
        onClick={downloadPDF}
        style={{ marginBottom: "20px", padding: "8px 12px" }}
      >
        Download PDF
      </button>

      {/* Material Boxes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {filteredItems.map(item => {
          const status = batchStatus[item._id] || { usedQuantity: 0 };
          const remainingQty = item.Quantity - status.usedQuantity;
          const expiry = new Date(item.ExpiryDate);
          const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

          let action = "Monitor closely";
          let boxColor = "#d4edda"; // green
          let actionColor = "green";

          if (daysLeft <= 5) {
            action = "Use immediately";
            boxColor = "#f8d7da"; // red
            actionColor = "red";
          } else if (daysLeft <= 8) {
            action = "Prioritize usage";
            boxColor = "#fff3cd"; // orange
            actionColor = "orange";
          }

          return (
            <div
              key={item._id}
              style={{
                borderRadius: "8px",
                padding: "20px",
                width: "100%",
                backgroundColor: boxColor,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              <h3 style={{ margin: "0 0 15px 0" }}>{item.productName}</h3>

              {/* Column Labels */}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginBottom: "5px" }}>
                <span>Batch</span>
                <span>Remaining Qty</span>
                <span>Expiry Date</span>
                <span>Days Left</span>
                <span>Suggested Action</span>
              </div>

              {/* Values Row */}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>{item.BatchNumber}</span>
                <span>{remainingQty} {item.Unit || ""}</span>
                <span>{expiry.toLocaleDateString()}</span>
                <span style={{ color: daysLeft <= 8 ? "red" : "black" }}>{daysLeft}</span>
                <span style={{ color: actionColor }}>{action}</span>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <p style={{ color: "red", fontWeight: "bold" }}>No materials expiring in the next 30 days.</p>
        )}
      </div>
    </div>
  );
};

export default ExpiryTracking;


