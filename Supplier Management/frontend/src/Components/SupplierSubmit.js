// frontend/src/Components/SupplierSubmit.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function SupplierSubmit() {
  const { id } = useParams(); // request id
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [supplierAmount, setSupplierAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Load request details
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5001/Requests/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setRequest(res.data);

        // initialize items array with request items
        const initItems = (res.data.items || []).map((it) => ({
          name: it.name,
          requestedQty: it.qty,
          qty: 0 // supplier fills this in
        }));
        setItems(initItems);
      } catch (err) {
        console.error("Load request error:", err.response?.data || err.message);
        alert("Failed to load request");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ✅ Handle supplier qty change
  const handleQtyChange = (index, value) => {
    const newItems = [...items];
    newItems[index].qty = Number(value);
    setItems(newItems);
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.every((it) => it.qty <= 0)) {
      alert("Please enter at least one quantity to supply.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // 🔥 Removed `res = ...` (unused variable warning fixed)
      await axios.post(
        `http://localhost:5001/Requests/${id}/submit`,
        {
          items,
          notes,
          supplierAmount
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      alert("Submission successful!");
      navigate("/supplier/requests"); // redirect after success
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Failed to submit");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!request) return <div style={{ padding: 24 }}>Request not found</div>;

  return (
    <div style={{ padding: 24 }}>
      <Link to="/supplier/requests" style={{ color: "#2196F3", textDecoration: "none" }}>
        ← Back to Requests
      </Link>

      <h2 style={{ margin: "12px 0" }}>Submit Supply for: {request.title}</h2>
      {request.description && (
        <p style={{ color: "#666" }}>{request.description}</p>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <strong>Items Requested:</strong>
          <table style={{ width: "100%", marginTop: 8, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: 8 }}>Item</th>
                <th style={{ padding: 8 }}>Requested Qty</th>
                <th style={{ padding: 8 }}>Your Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{item.name}</td>
                  <td style={{ padding: 8 }}>{item.requestedQty}</td>
                  <td style={{ padding: 8 }}>
                    <input
                      type="number"
                      min="0"
                      max={item.requestedQty}
                      value={item.qty}
                      onChange={(e) => handleQtyChange(idx, e.target.value)}
                      style={{
                        width: "100px",
                        padding: "6px",
                        border: "1px solid #ccc",
                        borderRadius: 4
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            style={{
              width: "100%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: 4
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Requested Amount (LKR)
          </label>
          <input
            type="number"
            min="0"
            value={supplierAmount}
            onChange={(e) => setSupplierAmount(Number(e.target.value))}
            style={{
              width: "200px",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: 4
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
