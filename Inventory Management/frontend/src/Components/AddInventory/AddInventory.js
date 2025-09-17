import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddInventory() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    productName: "",
    BatchNumber: "",
    Quantity: "",
    Unit:"",
    Supplier: "",
    ExpiryDate:""
    
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => navigate('/InventoriesPage'));
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:5000/inventories", {
      productName: String(inputs.productName),
      BatchNumber: Number(inputs.BatchNumber),
      Quantity: Number(inputs.Quantity),
      Unit: String(inputs.Unit),
      Supplier: String(inputs.Supplier),
      ExpiryDate:new Date(inputs.ExpiryDate)
    }).then(res => res.data);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "70px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#16a085" }}>Add New Inventory</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        
        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Raw Material</label>
        <input
          type="text"
          name="productName"
          onChange={handleChange}
          value={inputs.productName}
          required
          style={{ padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Batch Number</label>
        <input
          type="text"
          name="BatchNumber"
          onChange={handleChange}
          value={inputs.BatchNumber}
          required
          style={{ padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Quantity of Product</label>
        <input
          type="text"
          name="Quantity"
          onChange={handleChange}
          value={inputs.Quantity}
          required
          style={{ padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        />


        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Unit</label>
        <input
        type="text"
        name="Unit"
        onChange={handleChange}
        value={inputs.Unit}
        required
        style={{ padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Supplier Name</label>
        <input
          type="text"
          name="Supplier"
          onChange={handleChange}
          value={inputs.Supplier}
          required
          style={{ padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        
        <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Expiry Date</label>
        <input
        type="date"
        name="ExpiryDate"
        onChange={handleChange}
        value={inputs.ExpiryDate}
        required
        style={{ padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}
        />


      
        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#16a085",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#13856e"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#16a085"}
        >
          Submit
        </button>

      </form>
    </div>
  );
}

export default AddInventory;
