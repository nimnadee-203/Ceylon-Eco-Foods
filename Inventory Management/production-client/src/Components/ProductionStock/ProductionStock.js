import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

function ProductionStock(props) {
  const {
    _id,
    RequestNo,
    Material,
    Quantity,
    RequestedBy,
    RequestedDate,
    RequirementCondition,
    Note
  } = props.productionStock;

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/productionStocks/${_id}`);
    props.onDelete(_id); 
  };

  return (
                                      
    <div>
      <br></br>
      <br></br>     
      <h3>Production</h3>
      <h3>ID:{_id}</h3>
      <h3>Request No:{RequestNo}</h3>
      <h3>Material:{Material}</h3>
      <h3>Quantity:{Quantity}</h3>
      <h3>Requested By:{RequestedBy}</h3>
      <h3>Request Date:{new Date(RequestedDate).toLocaleDateString()}</h3>
      <h3>Requirement Condition: {RequirementCondition}</h3>
      <h3>Note: {Note}</h3>


      <button>
        <Link to={`/ProductionStocksPage/${_id}`}>UPDATE</Link>
      </button>

      <button onClick={deleteHandler}>DELETE</button>
    </div>
  );
}

export default ProductionStock;
