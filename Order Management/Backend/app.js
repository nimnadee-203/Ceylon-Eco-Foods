// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./Routes/OrderRoutes");
const SignupModel = require("./Model/SignupModel"); 
const AdminModel = require("./Model/AdminModel");
const productRoutes = require("./Routes/productRoutes");
const customerRoutes = require("./Routes/CustomerRoutes");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/orders", router);
app.use("/products", productRoutes);
app.use("/uploads", express.static("uploads")); // allow access to uploaded images
app.use("/api/customers", customerRoutes);

// Connect to MongoDB and start server
mongoose.connect("mongodb+srv://admin:H41K7FVcgbD2nUpI@cluster0.hz8wtum.mongodb.net/yourDB?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch(err => console.log("MongoDB connection error:", err));


// ===== Signup =====
app.post("/Customersignup", async (req, res) => {
    const { fullName, email, password, contactNumber, address } = req.body;
    try {
        await SignupModel.create({
            fullName, 
            email, 
            password,
            contactNumber, 
            address,
        });
        res.send({ status: "ok" });
    } catch (err) {
        res.status(500).send({ status: "err", error: err.message });
    }
});

// ===== Login =====
app.post("/Customerlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await SignupModel.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "User not found" });
    }

    if (customer.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", customer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin Signup
app.post("/Adminsignup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await AdminModel.create({ fullName, email, password });
    res.send({ status: "ok" });
  } catch (err) {
    res.status(500).send({ status: "err", error: err.message });
  }
});

// Admin Login
app.post("/Adminlogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    if (admin.password !== password) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
