//pass= 8LwRuSLc74Ue2rOo

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/InventoryRoutes");
const productionRouter = require("./Routes/ProductionStockRoutes");
const productionRequestRouter = require("./Routes/ProductionRequestRoutes");
const materialStockRouter = require("./Routes/MaterialStockRoutes");
const batchStatusRouter = require("./Routes/BatchStatusRoutes");

const app = express();
const cors = require("cors");

//Middlewear 
app.use(express.json());
app.use(cors());
app.use("/inventories",router);
app.use("/productionStocks", productionRouter);
app.use("/productionRequests", productionRequestRouter);
app.use("/materialStocks", materialStockRouter);
app.use("/batchStatus", batchStatusRouter);



mongoose.connect("mongodb+srv://admin:vuwtqzUIfuWussml@cluster0.qfmb9mh.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=> console.log((err)));
