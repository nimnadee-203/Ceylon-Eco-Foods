import React, { useState, useEffect } from 'react';
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const URL = "http://localhost:5000/productionStocks";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function ProductionStocks() {
  const [productionStocks, setProductionStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => setProductionStocks(data.productionStocks));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this production?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${id}`);
      setProductionStocks((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      console.error("Error deleting production:", err);
    }
  };

  const handleDownloadPDF = () => {
    const confirmDownload = window.confirm(
      "Do you want to download the Production Report?"
    );
    if (!confirmDownload) return;

    const doc = new jsPDF();
    doc.text("Production Report", 14, 15);          

    const tableColumn = [
      "ID",
      "Request No",
      "Material",
      "Quantity",
      "Requested By",
      "Requested Date",
      "Requirement Condition",
      "Note"
      
    ];
    const tableRows = [];

    productionStocks.forEach(pro => {            
      
      const proData = [
        pro._id,
        pro.RequestNo,
        pro.Material,
        pro.Quantity,
        pro.RequestedBy,
        new Date(pro.RequestedDate).toLocaleDateString(),
        pro.RequirementCondition,
        pro.Note
      ];
      tableRows.push(proData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("ProductionStock_Report.pdf");
  };

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredProductionStocks = data.productionStocks.filter((productionStock) =>
        Object.values(productionStock).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setProductionStocks(filteredProductionStocks);
      setNoResults(filteredProductionStocks.length === 0);
    });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Production Management</h2>

      {/* Add Production Button + Search & Download */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <button
            onClick={() => navigate("/SendMaterialRequestPage")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "20px"
            }}
          >
            + Send Request
          </button>

          <input
            style={{ padding: "8px", width: "300px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search Production Details"
          />
          <button 
            onClick={handleSearch} 
            style={{ padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }}
          >
            Search
          </button>
        </div>
        <div>
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
          <p>No Production stock Found</p>         
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
          <thead>
            <tr style={{ backgroundColor: "#16a085", color: "white" }}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Request No</th>
              <th style={styles.th}>Material</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Requested By</th>
              <th style={styles.th}>Requested Date</th>
              <th style={styles.th}>Requirement Condition</th>
              <th style={styles.th}>Note</th>
              <th style={styles.th}>Update</th>
              <th style={styles.th}>Delete</th>
            </tr>
          </thead>           
          <tbody>
            {productionStocks.map((pro, p) => (
              <tr key={p} style={{ backgroundColor: p % 2 === 0 ? "#f9f9f9" : "#ffffff", textAlign: "center" }}>
                <td style={styles.td}>{pro._id}</td>
                <td style={styles.td}>{pro.RequestNo}</td>
                <td style={styles.td}>{pro.Material}</td>
                <td style={styles.td}>{pro.Quantity}</td>
                <td style={styles.td}>{pro.RequestedBy}</td>
                <td style={styles.td}>{new Date(pro.RequestedDate).toLocaleDateString()}</td>
                <td style={styles.td}>{pro.RequirementCondition}</td>
                <td style={styles.td}>{pro.Note}</td>
                
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionBtn, backgroundColor: "#27ae60" }}
                    onClick={() => navigate(`/ProductionStocksPage/${pro._id}`)}
                  >
                    Update
                  </button>
                </td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionBtn, backgroundColor: "#c0392b" }}
                    onClick={() => handleDelete(pro._id)}
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
    verticalAlign: "top"
  },
  innerTh: {
    padding: "5px",
    border: "1px solid #ccc",
    fontWeight: "bold"
  },
  innerTd: {
    padding: "5px",
    border: "1px solid #ccc"
  },
  actionBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer"
  }
};

export default ProductionStocks;
