//pss=KxtNR2FQICWLmGv8
//mongodb+srv://DularaDB:KxtNR2FQICWLmGv8@cluster0.9yvmqai.mongodb.net/

/*const express = require('express');
const mongoose = require('mongoose'); 
const router = require('./Routes/SupplierRoutes');
const app = express(); 

//Middleware 
app.use("/",(req, res, next) => {
    res.send("It Is Working......."); 
})

mongoose.connect("mongodb+srv://DularaDB:KxtNR2FQICWLmGv8@cluster0.9yvmqai.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=> {
    app.listen(5001);
})
.catch((err)=> console.log(err));*/

require('events').EventEmitter.defaultMaxListeners = 20;

// backend/app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Routes
const supplierRoutes = require("./Routes/SupplierRoutes");
const requestRoutes = require("./Routes/RequestRoutes");
const adminRoutes = require("./Routes/AdminRoutes"); // 👈 add admin routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Route mounts
app.use("/Suppliers", supplierRoutes);
app.use("/Requests", requestRoutes);
app.use("/Admin", adminRoutes); // 👈 Admin endpoints
app.use('/Admin', require('./Routes/AdminRoutes'));

// Database connection
mongoose
  .connect(
    "mongodb+srv://DularaDB:KxtNR2FQICWLmGv8@cluster0.9yvmqai.mongodb.net/"
  )
  .then(() => {
    console.log(" Connected to MongoDB");
    app.listen(5001, () => console.log("Server running on http://localhost:5001"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
