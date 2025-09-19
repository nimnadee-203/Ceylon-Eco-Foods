// frontend/src/Components/AdminSuppliersList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AdminSuppliersList() {
  const [suppliers, setSuppliers] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5001/Admin/suppliers");
        if (mounted) setSuppliers(res.data || []);
      } catch (e) {
        console.error("load suppliers error", e.response || e.message);
        if (mounted) setErr("Failed to load suppliers");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    try {
      await axios.delete(`http://localhost:5001/Admin/suppliers/${id}`);
      setSuppliers(s => s.filter(x => x._id !== id));
    } catch (e) {
      console.error("delete error", e.response || e.message);
      alert("Failed to delete");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Suppliers (Admin)</h2>
        <div>
          <button onClick={() => navigate("/admin/suppliers/new")}>Add Supplier</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <ul>
        {suppliers.map(s => (
          <li key={s._id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{s.name}</strong> — {s.email} <div style={{ fontSize: 13 }}>{s.company}</div>
              </div>
              <div>
                <Link to={`/admin/suppliers/${s._id}/edit`} style={{ marginRight: 8 }}>Edit</Link>
                <button onClick={() => remove(s._id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
