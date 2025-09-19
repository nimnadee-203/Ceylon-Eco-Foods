// frontend/src/Components/AdminViewSubmissions.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function AdminViewSubmissions() {
  const { id: requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paidAmounts, setPaidAmounts] = useState({}); // keyed by submission id

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Load request details
      const reqRes = await axios.get(
        `http://localhost:5001/Requests/${requestId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setRequest(reqRes.data);

      // Load submissions
      const subsRes = await axios.get(
        `http://localhost:5001/Requests/${requestId}/submissions`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSubs(subsRes.data || []);

      // Set default paid amounts (use supplierAmount if no paidAmount yet)
      const defaults = {};
      (subsRes.data || []).forEach((s) => {
        defaults[s._id] = s.paidAmount ?? s.supplierAmount ?? 0;
      });
      setPaidAmounts(defaults);
    } catch (err) {
      console.error("Load error", err.response || err.message);
      alert("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    load();
  }, [load]);

  const accept = async (submissionId) => {
    const paid = Number(paidAmounts[submissionId] || 0);
    if (isNaN(paid) || paid <= 0) {
      alert("Enter a valid paid amount");
      return;
    }

    if (
      !window.confirm(
        `Accept this submission and record payment of LKR ${paid.toFixed(2)}?`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/Requests/${requestId}/submissions/${submissionId}/accept`,
        { paidAmount: paid },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      await load(); // reload data
      alert("Submission accepted and supplier balances updated");
    } catch (err) {
      console.error("Accept error", err.response || err.message);
      alert(err.response?.data?.message || "Failed to accept");
    }
  };

  const reject = async (submissionId) => {
    if (!window.confirm("Reject this submission?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5001/Requests/${requestId}/submissions/${submissionId}/reject`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      await load();
      alert("Submission rejected");
    } catch (err) {
      console.error("Reject error", err.response || err.message);
      alert("Failed to reject submission");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!request) return <div style={{ padding: 24 }}>Request not found</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <Link
          to="/admin/requests"
          style={{ color: "#2196F3", textDecoration: "none" }}
        >
          ← Back to Requests
        </Link>
        <h2 style={{ marginTop: 8 }}>Submissions for: {request.title}</h2>
        {request.description && (
          <p style={{ color: "#666" }}>{request.description}</p>
        )}
      </div>

      {subs.length === 0 ? (
        <div style={{ padding: 16, background: "#f5f5f5", borderRadius: 8 }}>
          No submissions yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {subs.map((s) => (
            <div
              key={s._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                background: "#fff",
              }}
            >
              {/* Supplier details */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{s.supplier?.name || "Unknown"}</strong>
                  <br />
                  <span style={{ color: "#666" }}>{s.supplier?.email}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div>Status: <strong>{s.status}</strong></div>
                  <div>
                    Requested:{" "}
                    <strong>
                      LKR {Number(s.supplierAmount || 0).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    Paid:{" "}
                    <strong>
                      LKR {Number(s.paidAmount || 0).toLocaleString()}
                    </strong>
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    Submitted: {new Date(s.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div style={{ marginTop: 8 }}>
                <strong>Items:</strong>
                <ul>
                  {(s.items || []).map((it, i) => (
                    <li key={i}>
                      {it.name} — {it.qty} pcs{" "}
                      {it.price
                        ? `— LKR ${Number(it.price).toFixed(2)}`
                        : ""}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions for pending submissions */}
              {s.status === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paidAmounts[s._id] ?? ""}
                    onChange={(e) =>
                      setPaidAmounts({
                        ...paidAmounts,
                        [s._id]: e.target.value,
                      })
                    }
                    style={{ padding: 6, flex: 1 }}
                    placeholder="Enter paid amount (LKR)"
                  />
                  <button
                    onClick={() => accept(s._id)}
                    style={{
                      padding: "6px 12px",
                      background: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => reject(s._id)}
                    style={{
                      padding: "6px 12px",
                      background: "#F44336",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
