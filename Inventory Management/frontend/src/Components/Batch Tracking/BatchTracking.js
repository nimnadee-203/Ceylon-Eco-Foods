import React, { useEffect, useState } from "react";
import axios from "axios";

function BatchTracking() {
  const [inventories, setInventories] = useState([]);
  const [batchStatus, setBatchStatus] = useState({});
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const invRes = await axios.get("http://localhost:5000/inventories");
      const batchRes = await axios.get("http://localhost:5000/batchStatus");

      setInventories(invRes.data.inventories || []);

      const statusMap = {};
      (batchRes.data.statuses || []).forEach(b => {
        statusMap[b.batchId] = b;
      });
      setBatchStatus(statusMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const handleBatchUpdate = () => fetchData();
    window.addEventListener("batchUpdated", handleBatchUpdate);
    return () => window.removeEventListener("batchUpdated", handleBatchUpdate);
  }, []);

  const handleUpdateUsage = async (batchId) => {
    const used = parseInt(prompt("Enter quantity used:"), 10);
    if (!used || used <= 0) return;
    try {
      await axios.put(`http://localhost:5000/batchStatus/update/${batchId}`, { usedQuantity: used });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Delete this batch?")) return;
    try {
      await axios.put(`http://localhost:5000/batchStatus/delete/${batchId}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = inventories
    .filter(inv => inv.productName.toLowerCase().includes(search.toLowerCase()))
    .filter(inv => !(batchStatus[inv._id]?.isDeleted));

  const groupedByMaterial = filtered.reduce((groups, inv) => {
    const key = inv.productName;
    if (!groups[key]) groups[key] = [];
    groups[key].push(inv);
    return groups;
  }, {});

  return (
    <div style={{ margin: "40px auto", padding: "20px", maxWidth: "1000px" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Batch Tracking</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by Raw Material"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "300px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      {Object.keys(groupedByMaterial).length > 0 ? (
        Object.keys(groupedByMaterial).map(material => {
          const batches = groupedByMaterial[material]
            .sort((a, b) => new Date(a.ExpiryDate) - new Date(b.ExpiryDate));

          return (
            <div key={material} style={{ marginBottom: "35px" }}>
              <h3 style={{ marginBottom: "12px", color: "#333" }}>{material}</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
                    <th style={thStyle}>Batch No</th>
                    <th style={thStyle}>Quantity</th>
                    <th style={thStyle}>Used</th>
                    <th style={thStyle}>Remaining</th>
                    <th style={thStyle}>Expiry</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map(inv => {
                    const status = batchStatus[inv._id] || { usedQuantity: 0 };
                    const remaining = inv.Quantity - status.usedQuantity;

                    return (
                      <tr key={inv._id} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={tdStyle}>{inv.BatchNumber}</td>
                        <td style={tdStyle}>{inv.Quantity}</td>
                        <td style={tdStyle}>{status.usedQuantity}</td>
                        <td style={tdStyle}>{remaining}</td>
                        <td style={tdStyle}>
                          {new Date(inv.ExpiryDate).toLocaleDateString()}
                        </td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => handleUpdateUsage(inv._id)}
                            style={btnStyle}
                          >
                            Update Usage
                          </button>
                          <button
                            onClick={() => handleDeleteBatch(inv._id)}
                            style={{ ...btnStyle, background: "#dc3545" }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>No batches found</p>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ccc"
};

const tdStyle = {
  padding: "10px"
};

const btnStyle = {
  padding: "6px 12px",
  marginRight: "8px",
  border: "none",
  borderRadius: "4px",
  background: "#19a056ff",
  color: "white",
  cursor: "pointer"
};

export default BatchTracking;
