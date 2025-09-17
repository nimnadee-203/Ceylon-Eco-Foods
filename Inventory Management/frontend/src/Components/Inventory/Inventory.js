import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';


function Inventory(props) {
 
    
  const{_id,productName,BatchNumber,Quantity,Unit,Supplier,CreatedDate,ExpiryDate} =props.inventory;

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/inventories/${_id}`);
    props.onDelete(_id); 
  };


  return (
    <div>
      <br></br>
      <br></br>
      <h3>Inventory</h3>
      <h3>ID:{_id}</h3>
      <h3>Product:{productName}</h3>
      <h3>Batch Number:{BatchNumber}</h3>
      <h3>Quantity:{Quantity}</h3>
      <h3>Unit:{Unit}</h3>
      <h3>Supplier:{Supplier}</h3>
      <h3>Created Date: {new Date(CreatedDate).toLocaleDateString()}</h3>
      <h3>Expiry Date: {new Date(ExpiryDate).toLocaleDateString()}</h3>

      <button>
      <Link to={`/InventoriesPage/${_id}`}>UPDATE</Link>
      </button>

      <button onClick={deleteHandler}>DELETE</button>
    </div>
  );
}

export default Inventory;