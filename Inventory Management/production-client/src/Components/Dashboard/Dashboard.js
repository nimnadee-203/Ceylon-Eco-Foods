import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const URL = "http://localhost:5000/productionStocks";

function Dashboard() {
  const [productionStocks, setProductionStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(URL).then((res) => setProductionStocks(res.data.productionStocks || []));
  }, []);

  // KPIs
  const totalRequests = productionStocks.length;
  const totalQuantity = productionStocks.reduce(
    (sum, stock) => sum + (parseInt(stock.Quantity) || 0),
    0
  );
  const lastRequest = productionStocks[productionStocks.length - 1];

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Production Dashboard
      </h2>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        <div style={styles.card}>
          <h3>Total Requests</h3>
          <p style={styles.number}>{totalRequests}</p>
        </div>
        <div style={styles.card}>
          <h3>Total Quantity</h3>
          <p style={styles.number}>{totalQuantity}</p>
        </div>
        <div style={styles.card}>
          <h3>Last Request</h3>
          <p style={{ fontSize: "14px" }}>
            {lastRequest
              ? `${lastRequest.Material} (${lastRequest.Quantity})`
              : "No data"}
          </p>
        </div>
      </div>

      {/* Recent Requests */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Recent Requests</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#16a085", color: "white" }}>
              <th style={styles.th}>Request No</th>
              <th style={styles.th}>Material</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Requested By</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {productionStocks.slice(-5).reverse().map((pro) => (
              <tr
                key={pro._id}
                style={{
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <td style={styles.td}>{pro.RequestNo}</td>
                <td style={styles.td}>{pro.Material}</td>
                <td style={styles.td}>{pro.Quantity}</td>
                <td style={styles.td}>{pro.RequestedBy}</td>
                <td style={styles.td}>
                  {new Date(pro.RequestedDate).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.btn, backgroundColor: "#3498db" }}
                    onClick={() => navigate(`/ProductionStocksPage/${pro._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  card: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  number: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#2c3e50",
  },
  th: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  btn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
  },
};

export default Dashboard;

