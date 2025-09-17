import React, { useState, useEffect } from 'react';
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

// Backend URL
const URL = "http://localhost:5000/inventories";

// Fetch all inventories
const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    // Handle both cases: array directly or { inventories: [...] }
    if (Array.isArray(res.data)) return res.data;
    if (res.data.inventories) return res.data.inventories;
    return [];
  } catch (err) {
    console.error("Error fetching inventories:", err);
    return [];
  }
};

function Inventories() {
  const [inventories, setInventories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  // Fetch inventories on component mount
  useEffect(() => {
    const getInventories = async () => {
      const data = await fetchHandler();
      setInventories(data);
    };
    getInventories();
  }, []);

  // Delete an inventory
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this inventory?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${id}`);
      setInventories(prev => prev.filter(inv => inv._id !== id));
    } catch (err) {
      console.error("Error deleting inventory:", err);
    }
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const confirmDownload = window.confirm("Do you want to download the Inventory Report?");
    if (!confirmDownload) return;

    const doc = new jsPDF();
    doc.text("Inventory Report", 14, 15);

    const tableColumn = ["ID", "Product", "Batch Number", "Quantity", "Unit", "Supplier", "Created Date", "Expiry Date"];
    const tableRows = (Array.isArray(inventories) ? inventories : []).map(inv => [
      inv._id,
      inv.productName,
      inv.BatchNumber,
      inv.Quantity,
      inv.Unit,
      inv.Supplier,
      new Date(inv.CreatedDate).toLocaleDateString(),
      new Date(inv.ExpiryDate).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("Inventory_Report.pdf");
  };

  // Search inventories
  const handleSearch = async () => {
    const data = await fetchHandler();
    const filteredInventories = (Array.isArray(data) ? data : []).filter(inv =>
      Object.values(inv).some(field =>
        field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setInventories(filteredInventories);
    setNoResults(filteredInventories.length === 0);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inventory Management</h2>

      {/* Search, Add & Download */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <input
            style={{ padding: "8px", width: "300px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search Inventory Details"
          />
          <button
            onClick={handleSearch}
            style={{ padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }}
          >
            Search
          </button>
        </div>

        {/* Right side buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/AddInventoryPage")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2980b9",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            + Add Inventory
          </button>

          <button
            onClick={handleDownloadPDF}
            style={{
              padding: "10px 20px",
              backgroundColor: "#16a085",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Table */}
      {noResults ? (
        <div style={{ textAlign: "center", color: "red" }}>
          <p>No Inventory Found</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
          <thead>
            <tr style={{ backgroundColor: "#16a085", color: "white" }}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Batch Number</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit</th>
              <th style={styles.th}>Supplier</th>
              <th style={styles.th}>Created Date</th>
              <th style={styles.th}>Expiry Date</th>
              <th style={styles.th}>Update</th>
              <th style={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(inventories) ? inventories : []).map((inv, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff", textAlign: "center" }}>
                <td style={styles.td}>{inv._id}</td>
                <td style={styles.td}>{inv.productName}</td>
                <td style={styles.td}>{inv.BatchNumber}</td>
                <td style={styles.td}>{inv.Quantity}</td>
                <td style={styles.td}>{inv.Unit}</td>
                <td style={styles.td}>{inv.Supplier}</td>
                <td style={styles.td}>{new Date(inv.CreatedDate).toLocaleDateString()}</td>
                <td style={styles.td}>{new Date(inv.ExpiryDate).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionBtn, backgroundColor: "#27ae60" }}
                    onClick={() => navigate(`/InventoriesPage/${inv._id}`)}
                  >
                    Update
                  </button>
                </td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionBtn, backgroundColor: "#c0392b" }}
                    onClick={() => handleDelete(inv._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  th: {
    padding: "10px",
    border: "1px solid #ddd",
    fontWeight: "bold"
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  actionBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer"
  }
};

export default Inventories;



