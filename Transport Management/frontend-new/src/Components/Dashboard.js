import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalDeliveries: 0,
    activeVehicles: 0,
    availableDrivers: 0,
    pendingMaintenance: 0
  });
  const [deliveriesPerMonth, setDeliveriesPerMonth] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState([]);
  const [driverStatus, setDriverStatus] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [routesOverview, setRoutesOverview] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // API calls (replace with your endpoints)
      const metricsRes = await axios.get("/api/dashboard/metrics");
      const deliveriesRes = await axios.get("/api/dashboard/deliveries-per-month");
      const vehicleRes = await axios.get("/api/dashboard/vehicle-status");
      const driverRes = await axios.get("/api/dashboard/driver-status");
      const recentDeliveriesRes = await axios.get("/api/dashboard/recent-deliveries");
      const maintenanceRes = await axios.get("/api/dashboard/maintenances-history");
      const routesRes = await axios.get("/api/dashboard/routes-overview");
      

      setMetrics(metricsRes.data);
      setDeliveriesPerMonth(deliveriesRes.data);
      setVehicleStatus(vehicleRes.data);
      setDriverStatus(driverRes.data);
      setRecentDeliveries(recentDeliveriesRes.data);
      setMaintenanceHistory(maintenanceRes.data);
      setRoutesOverview(routesRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const COLORS = ["#3366FF", "#28a745", "#ffc107", "#dc3545", "#6f42c1"];

  // ✅ Custom Legend for Pie Charts
  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
          >
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                borderRadius: "50%",
                marginRight: 6
              }}
            />
            <span style={{ fontSize: "14px", color: "#555" }}>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {/* 🏷 Header */}
      <div className="page-header">
        <h1 className="page-title">Transport Management Dashboard</h1>
        <p className="page-subtitle">
          Overview of your delivery and transport operations
        </p>
      </div>

      {/* 📊 Key Metrics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card bg-primary text-white">
            <h3>{metrics.totalDeliveries}</h3>
            <p>Total Deliveries</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success text-white">
            <h3>{metrics.activeVehicles}</h3>
            <p>Active Vehicles</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-warning text-white">
            <h3>{metrics.availableDrivers}</h3>
            <p>Available Drivers</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-danger text-white">
            <h3>{metrics.pendingMaintenance}</h3>
            <p>Pending Maintenance</p>
          </div>
        </div>
      </div>

      {/* 📈 Charts Section */}
      <div className="row mb-4">
        {/* Deliveries per Month */}
        <div className="col-md-6 mb-4">
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Deliveries per Month</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={deliveriesPerMonth}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                <Legend />
                <Bar
                  dataKey="deliveries"
                  fill="#3366FF"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {deliveriesPerMonth.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#3366FF"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) =>
                        e.target.setAttribute("fill", "#0056b3")
                      }
                      onMouseLeave={(e) =>
                        e.target.setAttribute("fill", "#3366FF")
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Status Pie */}
        <div className="col-md-3 mb-4">
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Vehicle Status</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={vehicleStatus}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                >
                  {vehicleStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => e.target.setAttribute("fill", "#444")}
                      onMouseLeave={(e) =>
                        e.target.setAttribute(
                          "fill",
                          COLORS[index % COLORS.length]
                        )
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend content={renderCustomLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Driver Status Pie */}
        <div className="col-md-3 mb-4">
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Driver Status</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={driverStatus}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                >
                  {driverStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => e.target.setAttribute("fill", "#444")}
                      onMouseLeave={(e) =>
                        e.target.setAttribute(
                          "fill",
                          COLORS[index % COLORS.length]
                        )
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend content={renderCustomLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 📦 Recent Deliveries */}
      <div className="data-table mb-4">
        <div className="table-header">
          <h3 className="table-title">Recent Deliveries</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Driver</th>
            </tr>
          </thead>
          <tbody>
            {recentDeliveries.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.date}</td>
                <td>{d.status}</td>
                <td>{d.driver}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔧 Maintenance History */}
      <div className="data-table mb-4">
        <div className="table-header">
          <h3 className="table-title">Maintenance History</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Issue</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceHistory.map((m) => (
              <tr key={m.id}>
                <td>{m.vehicle}</td>
                <td>{m.date}</td>
                <td>{m.issue}</td>
                <td>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🛣 Routes Overview */}
      <div className="data-table">
        <div className="table-header">
          <h3 className="table-title">Routes Overview</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Distance</th>
              <th>Deliveries</th>
            </tr>
          </thead>
          <tbody>
            {routesOverview.map((r) => (
              <tr key={r.id}>
                <td>{r.route}</td>
                <td>{r.distance}</td>
                <td>{r.deliveries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
