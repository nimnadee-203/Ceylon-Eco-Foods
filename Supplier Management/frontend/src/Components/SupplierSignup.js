// frontend/src/Components/SupplierSignup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SupplierSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await axios.post("http://localhost:5001/Suppliers/register", form);
      const user = res.data; // backend returns supplier object

      setMsg({ type: "success", text: `Registered as ${user.name}. Redirecting to login...` });
      setTimeout(() => navigate("/supplier/login"), 1200);
    } catch (err) {
      // 🔍 Debug log to browser console
      console.error("Signup error:", err.response?.data || err.message);

      const text =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";
      setMsg({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "36px auto", padding: 16 }}>
      <h2>Supplier Signup</h2>
      <form onSubmit={submit}>
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handle}
          required
        /><br/><br/>
        <input
          name="company"
          placeholder="Company (optional)"
          value={form.company}
          onChange={handle}
        /><br/><br/>
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handle}
          required
        /><br/><br/>
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handle}
          required
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
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      {msg && (
        <p style={{ color: msg.type === "error" ? "crimson" : "green", marginTop: 12 }}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
