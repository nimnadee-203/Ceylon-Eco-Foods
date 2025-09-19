// frontend/src/Components/AdminCreateRequest.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminCreateRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    items: [{ name: "", qty: 1 }],
    dueDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = field === 'qty' ? parseInt(value) || 0 : value;
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { name: "", qty: 1 }] });
  };

  const removeItem = (index) => {
    if (form.items.length > 1) {
      const newItems = form.items.filter((_, i) => i !== index);
      setForm({ ...form, items: newItems });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/Requests", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMsg({ type: "success", text: "Request created successfully!" });
      setTimeout(() => navigate("/admin/requests"), 1500);
    } catch (err) {
      console.error("Create request error:", err.response?.data || err.message);
      const text = err.response?.data?.message || err.response?.data?.error || "Failed to create request";
      setMsg({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "36px auto", padding: 16 }}>
      <h2>Create New Request</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 16 }}>
          <label>Title *</label><br/>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Description</label><br/>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4, height: 80 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Items *</label>
          {form.items.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                required
                style={{ flex: 1, padding: 8 }}
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                required
                min="1"
                style={{ width: 80, padding: 8 }}
              />
              {form.items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} style={{ padding: 8 }}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem} style={{ padding: 8, marginTop: 8 }}>
            Add Item
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Due Date</label><br/>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            style={{ padding: 8, marginTop: 4 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: 12, fontSize: 16 }}>
          {loading ? "Creating..." : "Create Request"}
        </button>
      </form>

      {msg && (
        <p style={{ 
          color: msg.type === "error" ? "crimson" : "green", 
          marginTop: 12,
          padding: 8,
          backgroundColor: msg.type === "error" ? "#ffe6e6" : "#e6ffe6",
          borderRadius: 4
        }}>
          {msg.text}
        </p>
      )}
    </div>
  );
}