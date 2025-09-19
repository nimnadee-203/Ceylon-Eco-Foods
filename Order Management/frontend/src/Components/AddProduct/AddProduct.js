import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AddProduct() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    productName: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    units: "",
    status: "Available",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const categoryOptions = ["Jam", "Cordial", "Sauce", "Paste", "Chutney", "Jelly"];
  const statusOptions = ["Available", "Out of Stock"];

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Image is required!");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(inputs).forEach((key) => formData.append(key, inputs[key]));
      formData.append("image", image);

      await axios.post("http://localhost:5000/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("Failed to add product. Try again!");
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
    backgroundColor: "#28a745",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "50px" }}>
      <div style={cardStyle}>
        <h2 className="text-center text-success mb-4" style={{ fontWeight: 700 }}>
          Add Product
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label" style={labelStyle}>Product Name</label>
            <input
              type="text"
              className="form-control"
              name="productName"
              value={inputs.productName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={labelStyle}>Category</label>
            <select
              className="form-select"
              name="category"
              value={inputs.category}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select a category</option>
              {categoryOptions.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label" style={labelStyle}>Description</label>
            <textarea
              className="form-control"
              name="description"
              value={inputs.description}
              onChange={handleChange}
              required
              style={{ ...inputStyle, minHeight: "80px" }}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={labelStyle}>Price (Rs.)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={inputs.price}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={labelStyle}>Stock</label>
              <input
                type="number"
                className="form-control"
                name="stock"
                value={inputs.stock}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={labelStyle}>Units</label>
            <input
              type="text"
              className="form-control"
              name="units"
              value={inputs.units}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={labelStyle}>Status</label>
            <select
              className="form-select"
              name="status"
              value={inputs.status}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              {statusOptions.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label" style={labelStyle}>Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={btnStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
