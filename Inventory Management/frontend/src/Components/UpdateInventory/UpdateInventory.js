import React, {useEffect,useState} from 'react'
import axios from 'axios'
import {useParams} from 'react-router'
import {useNavigate} from 'react-router'


function UpdateInventory() {

    const [inputs, setInputs]= useState({});
    const history = useNavigate();
    const id = useParams().id;
    
    useEffect(()=>{
        const fetchHandler = async()=>{
            await axios
            .get(`http://Localhost:5000/inventories/${id}`)
            .then((res)=>res.data)
            .then((data)=> setInputs(data.inventory));
        };
        fetchHandler();
    },[id]);

    const sendRequest =async ()=>{
        await axios
        .put(`http://Localhost:5000/inventories/${id}`,{
        productName: String(inputs.productName),
        BatchNumber:Number(inputs.BatchNumber),
        Quantity:Number(inputs.Quantity),
        Unit:String(inputs.Unit),
        Supplier:String(inputs.Supplier),
        ExpiryDate:new Date(inputs.ExpiryDate)
        })
        .then((res)=>res.data);
    };


     const handleChange =(e)=>{
    setInputs((prevState)=>({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit =(e)=>{
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(()=>history('/InventoriesPage'))
  };
   

  return (
    <div>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "70px auto" }}>
  {/* Product */}
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", marginBottom: "6px" }}>Product</label>
    <input
      type="text"
      name="productName"
      onChange={handleChange}
      value={inputs.productName || ""}
      required
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  </div>

  {/* Batch Number */}
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", marginBottom: "6px" }}>Batch Number</label>
    <input
      type="text"
      name="BatchNumber"
      onChange={handleChange}
      value={inputs.BatchNumber || ""}
      required
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  </div>

  {/* Quantity */}
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", marginBottom: "6px" }}>
      Quantity of Product
    </label>
    <input
      type="number"
      name="Quantity"
      onChange={handleChange}
      value={inputs.Quantity || ""}
      required
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  </div>

  {/* Unit */}
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", marginBottom: "6px" }}>Unit</label>
    <input
      type="text"
      name="Unit"
      onChange={handleChange}
      value={inputs.Unit || ""}
      required
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  </div>

  {/* Supplier */}
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", marginBottom: "6px" }}>
      Supplier Name
    </label>
    <input
      type="text"
      name="Supplier"
      onChange={handleChange}
      value={inputs.Supplier || ""}
      required
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  </div>

  {/* Expiry Date */}
  <div style={{ marginBottom: "20px" }}>
    <label style={{ display: "block", marginBottom: "6px" }}>Expiry Date</label>
    <input
      type="date"
      name="ExpiryDate"
      onChange={handleChange}
      value={inputs.ExpiryDate ? inputs.ExpiryDate.substring(0, 10) : ""}
      required
      style={{
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  </div>

  {/* Submit */}
  <div style={{ textAlign: "center" }}>
    <button
      type="submit"
      style={{
        backgroundColor: "#007BFF",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Submit
    </button>
  </div>
</form>

    </div>
  )
}

export default UpdateInventory;
