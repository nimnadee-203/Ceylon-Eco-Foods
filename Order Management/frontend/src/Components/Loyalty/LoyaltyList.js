import React, { useEffect, useState } from "react";
import axios from "axios";

function LoyaltyList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/customers");
        setCustomers(res.data.customers || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load loyalty data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers(); // first fetch
    const interval = setInterval(fetchCustomers, 5000); // auto-refresh every 5s

    return () => clearInterval(interval); // cleanup when component unmounts
  }, []);

  const getDiscountForTier = (tier) => {
    if (tier === "Platinum") return 15;
    if (tier === "Gold") return 10;
    if (tier === "Silver") return 5;
    return 0;
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Loyalty Members</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Name</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Email</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Tier</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Discount</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Total Orders</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Total Spent (LKR)</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Points</th>
            <th style={{ padding: 10, border: "1px solid #ccc" }}>Total Discount Received (LKR)</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.email} style={{ textAlign: "center" }}>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{c.fullName}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{c.email}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{c.loyaltyTier || 'Bronze'}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{getDiscountForTier(c.loyaltyTier)}%</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{c.totalOrders || 0}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{c.totalAmountSpent || 0}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{c.loyaltyPoints || 0}</td>
              <td style={{ padding: 10, border: "1px solid #ccc" }}>{c.totalDiscountReceived || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LoyaltyList;



