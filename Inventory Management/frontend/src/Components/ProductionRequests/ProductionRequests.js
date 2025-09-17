import React, { useEffect, useState } from "react";
import axios from "axios";

const REQUEST_URL = "http://localhost:5000/productionRequests";
const MATERIAL_URL = "http://localhost:5000/materialStocks";
const BATCH_URL = "http://localhost:5000/batchStatus";

function ProductionRequests() {
  const [requests, setRequests] = useState([]);
  const [materialStocks, setMaterialStocks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [batchInput, setBatchInput] = useState("");

  useEffect(() => {
    fetchRequests();
    fetchMaterialStocks();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(REQUEST_URL);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const fetchMaterialStocks = async () => {
    try {
      const res = await axios.get(MATERIAL_URL);
      const stockMap = {};
      res.data.materialStocks.forEach((item) => {
        stockMap[item.productName.trim().toLowerCase()] = Number(item.totalQuantity || 0);
      });
      setMaterialStocks(stockMap);
    } catch (err) {
      console.error("Error fetching material stocks:", err);
    }
  };

  const handleStatusUpdate = async (reqObj, status) => {
    try {
      if (status.toLowerCase() === "approved") {
        // ✅ Must have a batch number
        if (!batchInput.trim()) {
          alert("Please provide a batch number before approval.");
          return;
        }

        // ✅ Validate batch stock before approval
        try {
          await axios.put(`${BATCH_URL}/approveWithBatch`, {
            batchNumber: batchInput.trim(),
            quantity: reqObj.Quantity,
          });
        } catch (err) {
          console.error("Batch validation failed:", err);
          alert(err.response?.data?.message || "Batch validation failed");
          return; // ⛔ Stop here, don't approve request
        }
      }

      // ✅ If batch is valid (or not approving), update request status
      await axios.put(`${REQUEST_URL}/${reqObj._id}`, { Status: status });

      setRequests((prev) =>
        prev.map((r) => (r._id === reqObj._id ? { ...r, Status: status } : r))
      );

      if (status.toLowerCase() === "approved") {
        const key = reqObj.Material.trim().toLowerCase();

        // Deduct material stock
        setMaterialStocks((prev) => ({
          ...prev,
          [key]: (prev[key] || 0) - Number(reqObj.Quantity),
        }));

        // ✅ Dispatch event to update BatchTracking
        window.dispatchEvent(new Event("batchUpdated"));
      }
    } catch (err) {
      console.error("Error updating request status:", err);
      alert(err.response?.data?.message || "Failed to update request status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${REQUEST_URL}/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting request:", err);
      alert("Failed to delete request");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "70px auto", padding: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Production Requests & Approvals
      </h2>

      <div>
        {requests.map((req) => {
          const stock = materialStocks[req.Material.trim().toLowerCase()] || 0;
          const canApprove = req.Status.toLowerCase() === "pending" && stock >= req.Quantity;
          const statusLower = req.Status.toLowerCase();

          return (
            <div
              key={req._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "14px",
                marginBottom: "16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <strong>{req.RequestNo}</strong>
                  <span
                    style={{
                      marginLeft: "8px",
                      padding: "3px 9px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      backgroundColor:
                        statusLower === "pending"
                          ? "#f1c40f"
                          : statusLower === "approved"
                          ? "#2ecc71"
                          : "#e74c3c",
                      color: "white",
                    }}
                  >
                    {req.Status}
                  </span>
                </div>

                <div>
                  {statusLower === "pending" ? (
                    <>
                      <button
                        style={{
                          marginRight: "6px",
                          backgroundColor: canApprove ? "#27ae60" : "#95a5a6",
                          color: "white",
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: canApprove ? "pointer" : "not-allowed",
                        }}
                        onClick={() => {
                          if (!canApprove) return;
                          setCurrentRequest(req);
                          setBatchInput("");
                          setShowModal(true);
                        }}
                        disabled={!canApprove}
                      >
                        ✓ Approve
                      </button>
                      <button
                        style={{
                          backgroundColor: "#c0392b",
                          color: "white",
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "5px",
                        }}
                        onClick={() => handleStatusUpdate(req, "Denied")}
                      >
                        ✕ Deny
                      </button>
                    </>
                  ) : (
                    <button
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "5px",
                      }}
                      onClick={() => handleDelete(req._id)}
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 20px" }}>
                <p><strong>Material:</strong> {req.Material}</p>
                <p><strong>Need Quantity:</strong> {req.Quantity}kg</p>
                <p><strong>Requested By:</strong> {req.RequestedBy}</p>
                <p><strong>Current Stock:</strong> {stock}kg</p>
                <p><strong>Request Date:</strong> {new Date(req.RequestedDate).toLocaleDateString()}</p>
                {req.RequirementCondition && <p><strong>Condition:</strong> {req.RequirementCondition}</p>}
                {req.Note && <p><strong>Note:</strong> {req.Note}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", width: "350px", textAlign: "center" }}>
            <h3 style={{ marginBottom: "12px" }}>Enter Batch Number</h3>
            <input
              type="text"
              placeholder="Batch Number"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                style={{ backgroundColor: "#27ae60", color: "white", border: "none", padding: "8px 14px", borderRadius: "5px" }}
                onClick={() => {
                  setShowModal(false);
                  handleStatusUpdate(currentRequest, "Approved");
                }}
              >
                OK
              </button>
              <button
                style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "8px 14px", borderRadius: "5px" }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductionRequests;

