// Password DrM7xbu646fMzTEp
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const deliveriesRoutes = require("./Route/DeliveriesRoutes");
const vehiclesRoutes = require("./Route/VehiclesRoutes");
const driversRoutes = require("./Route/DriversRoutes");
const routesRoutes = require("./Route/RoutesRoutes");
const maintenancesRoutes = require("./Route/MaintenancesRoutes");
const dashboardRoutes = require("./Route/DashboardRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Mount routes
app.use("/deliveries", deliveriesRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/drivers", driversRoutes);
app.use("/routes", routesRoutes);
app.use("/maintenances", maintenancesRoutes);
app.use("/dashboard", dashboardRoutes);

// MongoDB Atlas
mongoose
  .connect("mongodb+srv://Sheron:DrM7xbu646fMzTEp@cluster0.rp8fhsq.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
