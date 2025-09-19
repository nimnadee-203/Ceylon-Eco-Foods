// frontend/src/Components/AdminAddSupplier.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminAddSupplier() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    company: "", 
    phone: "", 
    address: "" 
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/Admin/suppliers", form); // ✅ no unused variable
      setMsg({ type: "success", text: "Supplier added" });
      setTimeout(() => navigate("/admin/suppliers"), 900);
    } catch (err) {
      console.error("add supplier error", err.response || err.message);
      setMsg({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to add supplier" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2>Add Supplier</h2>
      <form onSubmit={submit}>
        <input 
          name="name" 
          placeholder="Name" 
          value={form.name} 
          onChange={handle} 
          required 
        /><br/><br/>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handle} 
          required 
        /><br/><br/>
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={handle} 
          required 
        /><br/><br/>
        <input 
          name="company" 
          placeholder="Company" 
          value={form.company} 
          onChange={handle} 
        /><br/><br/>
        <input 
          name="phone" 
          placeholder="Phone" 
          value={form.phone} 
          onChange={handle} 
        /><br/><br/>
        <input 
          name="address" 
          placeholder="Address" 
          value={form.address} 
          onChange={handle} 
        /><br/><br/>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Supplier"}
        </button>
      </form>

      {msg && (
        <p style={{ color: msg.type === "error" ? "crimson" : "green" }}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
