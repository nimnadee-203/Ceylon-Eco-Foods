import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SendMaterialRequest() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    RequestNo: "",
    Material: "",
    Quantity: "",
    RequestedBy: "",
    RequestedDate: "",
    RequirementCondition: "",
    Note: "",
  });

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "Quantity" ? value.replace(/\D/, "") : value, // only digits
    }));
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.RequestNo || !inputs.Material || !inputs.Quantity || !inputs.RequestedBy) {
      alert("Please fill required fields.");
      return;
    }

    const requestData = {
      RequestNo: inputs.RequestNo,
      Material: inputs.Material,
      Quantity: Number(inputs.Quantity),
      RequestedBy: inputs.RequestedBy,
      RequestedDate: inputs.RequestedDate ? new Date(inputs.RequestedDate) : new Date(),
      RequirementCondition: inputs.RequirementCondition,
      Note: inputs.Note,
    };

    try {
      await axios.post("http://localhost:5000/productionStocks", requestData);
      await axios.post("http://localhost:5000/productionRequests", requestData);

      alert("✅ Request sent successfully!");

      // Reset form
      setInputs({
        RequestNo: "",
        Material: "",
        Quantity: "",
        RequestedBy: "",
        RequestedDate: "",
        RequirementCondition: "",
        Note: "",
      });

      navigate("/ProductionStocksPage");
    } catch (err) {
      console.error("Error sending request:", err);
      alert("❌ Failed to send request. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "70px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#16a085",
        }}
      >
        Send Raw Material Request
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <FormInput
          label="Request No"
          name="RequestNo"
          value={inputs.RequestNo}
          onChange={handleChange}
        />
        <FormInput
          label="Material"
          name="Material"
          value={inputs.Material}
          onChange={handleChange}
        />
        <FormInput
          label="Quantity"
          name="Quantity"
          value={inputs.Quantity}
          onChange={handleChange}
        />
        <FormInput
          label="Requested By"
          name="RequestedBy"
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
          value={inputs.RequirementCondition}
          onChange={handleChange}
        />
        <FormInput
          label="Note"
          name="Note"
          value={inputs.Note}
          onChange={handleChange}
        />
        <button type="submit" style={submitBtn}>
          Submit
        </button>
      </form>
    </div>
  );
}

// Reusable input component
function FormInput({ label, name, type = "text", value, onChange }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}
      >
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
          backgroundColor: "white",
        }}
      />
    </div>
  );
}

const submitBtn = {
  padding: "12px",
  backgroundColor: "#16a085",
  color: "white",
  fontWeight: "bold",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default SendMaterialRequest;

