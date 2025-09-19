import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    productName: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    units: "",
    status: "",
    image: null,
  });

  const categories = ["Jam", "Cordial", "Sauce", "Paste", "Chutney","Jelly"];
  const statuses = ["Available", "Out of Stock"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        const data = res.data.product;
        setInputs({
          productName: data.productName || "",
          category: data.category || "",
          description: data.description || "",
          price: data.price || "",
          stock: data.stock || "",
          units: data.units || "",
          status: data.status || "",
          image: null,
        });
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setInputs((prev) => ({ ...prev, image: files[0] }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(inputs).forEach((key) => {
        if (key !== "image") formData.append(key, inputs[key]);
      });
      if (inputs.image) formData.append("image", inputs.image);

      await axios.put(`http://localhost:5000/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/products");
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
    padding: "30px",
    maxWidth: "600px",
    margin: "50px auto",
    backgroundColor: "#fff",
  };

  const labelStyle = { fontWeight: 600, color: "#555" };
  const inputStyle = { borderRadius: "8px", padding: "10px", border: "1px solid #ccc" };
  const btnStyle = {
    borderRadius: "8px",
    padding: "12px",
    fontWeight: 600,
    fontSize: "16px",
    backgroundColor: "#007bff",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "50px" }}>
      <div style={cardStyle}>
        <h2 className="text-center text-primary mb-4" style={{ fontWeight: 700 }}>
          Update Product
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label style={labelStyle}>Product Name</label>
            <input
              type="text"
              name="productName"
              value={inputs.productName}
              onChange={handleChange}
              className="form-control"
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Category</label>
            <select
              name="category"
              value={inputs.category}
              onChange={handleChange}
              className="form-select"
              required
              style={inputStyle}
            >
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              className="form-control"
              required
              style={{ ...inputStyle, minHeight: "80px" }}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label style={labelStyle}>Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={inputs.price}
                onChange={handleChange}
                className="form-control"
                required
                style={inputStyle}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label style={labelStyle}>Stock</label>
              <input
                type="number"
                name="stock"
                value={inputs.stock}
                onChange={handleChange}
                className="form-control"
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Units</label>
            <input
              type="text"
              name="units"
              value={inputs.units}
              onChange={handleChange}
              className="form-control"
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-3">
            <label style={labelStyle}>Status</label>
            <select
              name="status"
              value={inputs.status}
              onChange={handleChange}
              className="form-select"
              required
              style={inputStyle}
            >
              <option value="">Select Status</option>
              {statuses.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label style={labelStyle}>Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="form-control"
              accept="image/*"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={btnStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0069d9")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;
