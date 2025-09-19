import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "../Product/Product"; // your Product component
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/products";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [noResults, setNoResults] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(URL);
        const fetchedProducts = res.data.products || [];
        const sortedProducts = [...fetchedProducts].sort((a, b) =>
          a.productName > b.productName ? 1 : -1
        );
        setProducts(sortedProducts);
        setAllProducts(sortedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setAllProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // Download PDF
  const downloadPDF = () => {
    const confirmDownload = window.confirm(
      "Do you want to download the Products Report as a PDF?"
    );
    if (!confirmDownload) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Products Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Product Name", "Category", "Price", "Stock", "Units", "Status"];
    const tableRows = [];

    products.forEach((p) => {
      const rowData = [
        p.productName,
        p.category,
        `Rs. ${Number(p.price).toFixed(2)}`,
        p.stock,
        p.units,
        p.status,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [76, 175, 80] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`Products_Report_${new Date().toLocaleDateString()}.pdf`);
  };

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts(allProducts);
      setNoResults(false);
      return;
    }

    let filtered = [];
    if (searchField === "productName") {
      filtered = allProducts.filter((p) =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      filtered = allProducts.filter((p) =>
        Object.values(p).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setProducts(filtered);
    setNoResults(filtered.length === 0);
  }, [searchQuery, searchField, allProducts]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h1 style={{ margin: 20 }}>Products</h1>

        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/add-product")}
            style={{
              background: "#4CAF50",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ➕ Add New Product
          </button>

          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          >
            <option value="all">All Fields</option>
            <option value="productName">Product Name</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${searchField === "productName" ? "Product Name" : "anything"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: "14px",
              minWidth: "180px",
            }}
          />

          <button
            onClick={downloadPDF}
            style={{
              background: "#4CAF50",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Product List */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "10px 0"
        }}
      >
        {noResults ? (
          <p>No products found for "{searchQuery}"</p>
        ) : products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((p) => <Product key={p._id} product={p} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  );
}

export default Products;
