const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes import
const employeeRoutes = require("./Routes/employeeRoutes");
const dailyTargetRoutes = require("./Routes/DailyTargetRoutes");
const scheduleRoutes = require("./Routes/scheduleRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes"); // Dashboard route
const employeeDashboardRoutes = require("./Routes/employeeDashboardRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route mapping
app.use("/employees", employeeRoutes);
app.use("/daily-targets", dailyTargetRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/dashboard", dashboardRoutes); // Dashboard route
app.use("/employee-dashboard-api", employeeDashboardRoutes);

// Database connection
mongoose.connect(
  "mongodb+srv://admin:JUwUDpcSaYVhD9qs@cluster0.shtp6hn.mongodb.net/yourDatabaseName?retryWrites=true&w=majority"
)
.then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
})
.catch(err => console.error("❌ DB connection error:", err));
