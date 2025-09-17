import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [inventories, setInventories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const INVENTORY_URL = "http://localhost:5000/inventories";
  const REQUEST_URL = "http://localhost:5000/productionRequests";

  // Fetch inventories
  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const res = await axios.get(INVENTORY_URL);
        if (Array.isArray(res.data)) {
          setInventories(res.data);
        } else if (res.data.inventories) {
          setInventories(res.data.inventories);
        } else {
          setInventories([]);
        }
      } catch (err) {
        console.error("Error fetching inventories:", err);
        setInventories([]);
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await axios.get(REQUEST_URL);
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error("Error fetching production requests:", err);
        setRequests([]);
      }
    };

    Promise.all([fetchInventories(), fetchRequests()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Summary calculations
  const totalItems = inventories.length;

  // Expiring soon (≤ 30 days)
  const expiringSoon = inventories.filter((inv) => {
    const today = new Date();
    const expiry = new Date(inv.ExpiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  });

  // Expiring urgent (≤ 8 days)
  const expiringUrgent = inventories.filter((inv) => {
    const today = new Date();
    const expiry = new Date(inv.ExpiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 8;
  });

  // Recent inventories
  const recentInventories = [...inventories]
    .sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate))
    .slice(0, 5);

  // Production request stats
  const pendingRequests = requests.filter(
    (req) => req.Status.toLowerCase() === "pending"
  );

  // Last 5 pending requests
  const recentPending = [...pendingRequests]
    .sort((a, b) => new Date(b.RequestedDate) - new Date(a.RequestedDate))
    .slice(0, 5);

  return (
    <div style={{ maxWidth: "1200px", margin: "30px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Dashboard</h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <>
          {/* Expiry Alerts */}
          {expiringUrgent.length > 0 && (
            <div style={styles.alertBox}>
              <h3 style={styles.alertTitle}>⚠️ Expiry Alerts (Next 8 Days)</h3>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {expiringUrgent.map((inv, i) => {
                  const today = new Date();
                  const expiry = new Date(inv.ExpiryDate);
                  const diffDays = Math.ceil(
                    (expiry - today) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <li key={i} style={{ marginBottom: "6px" }}>
                      <strong>{inv.productName}</strong> (Batch {inv.BatchNumber}) —{" "}
                      <span style={{ color: diffDays <= 5 ? "red" : "orange" }}>
                        {diffDays} days left
                      </span>{" "}
                      (Expires on {expiry.toLocaleDateString()})
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Production Request Alerts */}
          {pendingRequests.length > 0 && (
            <div style={styles.alertBox}>
              <h3 style={styles.alertTitle}>📢 Pending Production Requests</h3>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {recentPending.map((req, i) => (
                  <li key={i} style={{ marginBottom: "6px" }}>
                    <strong>{req.RequestNo}</strong> — {req.Material} (
                    {req.Quantity}kg) requested by {req.RequestedBy} on{" "}
                    {new Date(req.RequestedDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary Cards */}
          <div style={styles.cardsRow}>
            <div style={styles.card}>
              <h3>Total Batches</h3>
              <p>{totalItems}</p>
            </div>
            <div style={styles.card}>
              <h3>Pending Requests</h3>
              <p>{pendingRequests.length}</p>
            </div>
            <div style={styles.card}>
              <h3>Expiring Soon</h3>
              <p>{expiringSoon.length}</p>
            </div>
          </div>

          {/* Recent Inventory Table */}
          <div>
            <h2 style={{ marginBottom: "15px" }}>Recent Inventory Batches</h2>
            <table style={styles.table}>
              <thead>
                <tr style={{ backgroundColor: "#16a085", color: "white" }}>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Batch</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Unit</th>
                  <th style={styles.th}>Supplier</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {recentInventories.length > 0 ? (
                  recentInventories.map((inv, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff",
                        textAlign: "center",
                      }}
                    >
                      <td style={styles.td}>{inv.productName}</td>
                      <td style={styles.td}>{inv.BatchNumber}</td>
                      <td style={styles.td}>{inv.Quantity}</td>
                      <td style={styles.td}>{inv.Unit}</td>
                      <td style={styles.td}>{inv.Supplier}</td>
                      <td style={styles.td}>
                        {new Date(inv.CreatedDate).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {new Date(inv.ExpiryDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: "center", padding: "15px" }} colSpan="7">
                      No inventory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  alertBox: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeeba",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  alertTitle: {
    margin: "0 0 10px 0",
    color: "#856404",
  },
  cardsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
    gap: "20px",
  },
  card: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#ecf0f1",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    padding: "10px",
    border: "1px solid #ddd",
    fontWeight: "bold",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
};

export default Dashboard;
