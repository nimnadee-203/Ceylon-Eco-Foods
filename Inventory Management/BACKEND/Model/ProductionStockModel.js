const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const productionStockSchema = new Schema({              
 RequestNo: {
    type: String,
    required: true,
  },

  Material: {
    type: String,
    required: true,
  },

  Quantity: {
    type: String,
    required: true,
  },

  RequestedBy: {
    type: String,
    required: true,
  },

  RequestedDate: {
    type: Date,
  },

  RequirementCondition: {
    type: String,
    required: true,
  },

  
  Note: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ProductionStock", productionStockSchema);
