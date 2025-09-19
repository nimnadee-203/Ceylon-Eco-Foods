// frontend/src/Components/AdminEditSupplier.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", phone: "", address: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get(`http://localhost:5001/Admin/suppliers/${id}`);
        if (!mounted) return;
        setForm({ name: res.data.name || "", email: res.data.email || "", password: "", company: res.data.company || "", phone: res.data.phone || "", address: res.data.address || "" });
      } catch (err) {
        console.error("load supplier", err.response || err.message);
        setMsg({ type: 'error', text: 'Failed to load supplier' });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const payload = { ...form };
      // don't send empty password if unchanged
      if (!payload.password) delete payload.password;
      await axios.put(`http://localhost:5001/Admin/suppliers/${id}`, payload);
      setMsg({ type: 'success', text: 'Supplier updated' });
      setTimeout(() => navigate("/admin/suppliers"), 900);
    } catch (err) {
      console.error("update supplier", err.response || err.message);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2>Edit Supplier</h2>
      <form onSubmit={submit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handle} required /><br/><br/>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required /><br/><br/>
        <input name="password" type="password" placeholder="Password (leave blank to keep unchanged)" value={form.password} onChange={handle} /><br/><br/>
        <input name="company" placeholder="Company" value={form.company} onChange={handle} /><br/><br/>
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handle} /><br/><br/>
        <input name="address" placeholder="Address" value={form.address} onChange={handle} /><br/><br/>

        <button type="submit">Save</button>
      </form>

      {msg && <p style={{ color: msg.type === 'error' ? 'crimson' : 'green' }}>{msg.text}</p>}
    </div>
  );
}
