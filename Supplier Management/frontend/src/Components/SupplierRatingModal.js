// frontend/src/Components/SupplierRatingModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SupplierRatingModal({ supplier, isOpen, onClose, onRatingUpdate }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    if (isOpen && supplier) {
      loadExistingRating();
    }
  }, [isOpen, supplier]);

  const loadExistingRating = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5001/Suppliers/${supplier._id}/ratings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Find current admin's rating
      const adminRating = res.data.ratings.find(r => r.ratedBy._id === JSON.parse(localStorage.getItem("token").split('.')[1]).id);
      if (adminRating) {
        setExistingRating(adminRating);
        setRating(adminRating.rating);
        setComment(adminRating.comment);
      } else {
        setRating(0);
        setComment("");
      }
    } catch (err) {
      console.error("Failed to load existing rating:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5001/Suppliers/${supplier._id}/rate`, {
        rating: rating,
        comment: comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onRatingUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setError(null);
    setExistingRating(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: 8,
        padding: 24,
        maxWidth: 500,
        width: "90%",
        maxHeight: "90%",
        overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Rate Supplier</h3>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#666"
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 8px 0" }}>{supplier.name}</h4>
          <p style={{ margin: 0, color: "#666" }}>{supplier.email}</p>
          {supplier.company && <p style={{ margin: 0, color: "#666" }}>{supplier.company}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Rating *
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 32,
                    cursor: "pointer",
                    color: star <= rating ? "#FFD700" : "#ddd",
                    padding: 0
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
              {rating === 0 && "Select a rating"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment about this supplier..."
              style={{
                width: "100%",
                minHeight: 80,
                padding: 8,
                border: "1px solid #ddd",
                borderRadius: 4,
                resize: "vertical"
              }}
            />
          </div>

          {error && (
            <div style={{ 
              color: "crimson", 
              marginBottom: 16, 
              padding: 8, 
              backgroundColor: "#ffe6e6", 
              borderRadius: 4 
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: 4,
                background: "white",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating < 1}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: 4,
                background: rating < 1 ? "#ccc" : "#4CAF50",
                color: "white",
                cursor: rating < 1 ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
