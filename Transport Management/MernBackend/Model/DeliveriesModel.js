

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliveriesSchema = new Schema({

    orderId:{
        type:Number, // data type
        required:true, // validate
    },
    customerName:{
        type:String, 
        required:true, 
    },
    address:{
        type:String, 
        required:true, 
    },
    deliveriesDate:{
        type:Date, 
        required:true, 
    },
    status:{
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending",
    },


});

module.exports = mongoose.model(
    "DeliveriesModel", // file name
     deliveriesSchema // function name

)
