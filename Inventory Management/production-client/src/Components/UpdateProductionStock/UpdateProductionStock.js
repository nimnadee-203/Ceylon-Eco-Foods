import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateProductionStock() {
  const [inputs, setInputs] = useState({
    RequestNo: "",
    Material: "",
    Quantity: "",
    RequestedBy: "",
    RequestedDate: "",
    RequirementCondition: "",
    Note: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing production stock
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/productionStocks/${id}`);
        const stock = data.productionStock;

        if (stock.RequestedDate) {
          stock.RequestedDate = stock.RequestedDate.substring(0, 10); // format for input[type=date]
        }

        setInputs({
          RequestNo: stock.RequestNo || "",
          Material: stock.Material || "",
          Quantity: stock.Quantity || "",
          RequestedBy: stock.RequestedBy || "",
          RequestedDate: stock.RequestedDate || "",
          RequirementCondition: stock.RequirementCondition || "",
          Note: stock.Note || "",
        });
      } catch (err) {
        console.error("Error fetching production stock:", err);
      }
    };
    fetchHandler();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/productionStocks/${id}`, {
        ...inputs,
        RequestedDate: new Date(inputs.RequestedDate),
      });
      navigate("/ProductionStocksPage");
    } catch (err) {
      console.error("Error updating production stock:", err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "70px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#16a085" }}>
        Update Production Stock
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <FormInput
          label="Request No"
          name="RequestNo"
          type="text"
          value={inputs.RequestNo}
          onChange={handleChange}
        />
        <FormInput
          label="Material"
          name="Material"
          type="text"
          value={inputs.Material}
          onChange={handleChange}
        />
        <FormInput
          label="Quantity"
          name="Quantity"
          type="number"
          value={inputs.Quantity}
          onChange={handleChange}
        />
        <FormInput
          label="Requested By"
          name="RequestedBy"
          type="text"
          value={inputs.RequestedBy}
          onChange={handleChange}
        />
        <FormInput
          label="Requested Date"
          name="RequestedDate"
          type="date"
          value={inputs.RequestedDate}
          onChange={handleChange}
        />
        <FormInput
          label="Requirement Condition"
          name="RequirementCondition"
          type="text"
          value={inputs.RequirementCondition}
          onChange={handleChange}
        />
        <FormInput
          label="Note"
          name="Note"
          type="text"
          value={inputs.Note}
          onChange={handleChange}
        />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#16a085",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable input component
function FormInput({ label, name, type, value, onChange }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />
    </div>
  );
}

export default UpdateProductionStock;
