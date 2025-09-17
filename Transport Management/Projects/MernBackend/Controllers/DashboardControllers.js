const Deliveries = require("../Model/DeliveriesModel");
const Drivers = require("../Model/DriversModel");
const Vehicles = require("../Model/VehiclesModel");
const Maintenances = require("../Model/MaintenancesModel");
const Routes = require("../Model/RoutesModel");

// 📊 1. Dashboard Metrics
const getMetrics = async (req, res) => {
  try {
    const totalDeliveries = await Deliveries.countDocuments();
    const activeVehicles = await Vehicles.countDocuments({ status: "active" });
    const availableDrivers = await Drivers.countDocuments({ status: "available" });
    const pendingMaintenance = await Maintenances.countDocuments({ status: "pending" });

    res.json({ totalDeliveries, activeVehicles, availableDrivers, pendingMaintenance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching metrics", error });
  }
};

// 📈 2. Deliveries per Month
const getDeliveriesPerMonth = async (req, res) => {
  try {
    const deliveries = await Deliveries.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          deliveries: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formatted = deliveries.map(d => ({
      month: months[d._id - 1],
      deliveries: d.deliveries
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries per month", error });
  }
};

// 🚙 3. Vehicle Status
const getVehicleStatus = async (req, res) => {
  try {
    const status = await Vehicles.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);

    const formatted = status.map(s => ({ name: s._id, value: s.value }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vehicle status", error });
  }
};

// 👨‍✈️ 4. Driver Status
const getDriverStatus = async (req, res) => {
  try {
    const status = await Drivers.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ]);

    const formatted = status.map(s => ({ name: s._id, value: s.value }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching driver status", error });
  }
};

// 📦 5. Recent Deliveries
const getRecentDeliveries = async (req, res) => {
  try {
    const deliveries = await Deliveries.find()
      .sort({ date: -1 })
      .limit(5);

    const formatted = deliveries.map(d => ({
      id: d._id,
      date: d.date,
      status: d.status,
      driver: d.driverName,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent deliveries", error });
  }
};

// 🔧 6. Maintenance History
const getMaintenanceHistory = async (req, res) => {
  try {
    const maintenances = await Maintenances.find()
      .sort({ date: -1 })
      .limit(5);

    const formatted = maintenances.map(m => ({
      id: m._id,
      vehicle: m.vehicle,
      date: m.date,
      issue: m.issue,
      status: m.status,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching maintenance history", error });
  }
};

// 🛣 7. Routes Overview
const getRoutesOverview = async (req, res) => {
  try {
    const routes = await Routes.find().limit(5);

    const formatted = routes.map(r => ({
      id: r._id,
      route: r.name,
      distance: r.distance,
      deliveries: r.deliveriesCount,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching routes overview", error });
  }
};

module.exports = {
  getMetrics,
  getDeliveriesPerMonth,
  getVehicleStatus,
  getDriverStatus,
  getRecentDeliveries,
  getMaintenanceHistory,
  getRoutesOverview,
};
