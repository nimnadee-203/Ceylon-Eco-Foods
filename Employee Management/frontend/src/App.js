import { Routes, Route, useLocation } from "react-router-dom";
import DashboardNav from "./Component/Dashboard/DashboardNav";
import DashboardHome from "./Component/Dashboard/DashboardHome";

import EmployeeLogin from "./Component/EmployeeLogin/EmployeeLogin";
import EmployeeDashboard from "./Component/EmployeeDashboard/EmployeeDashboard";

import EmployeeHome from "./Component/Employee/EmployeeHome";
import AddEmployee from "./Component/Employee/AddEmployee";
import EmployeeDetails from "./Component/Employee/EmployeeDetails";
import UpdateEmployee from "./Component/Employee/UpdateEmployee";

import TargetHome from "./Component/Target/Home";
import AddTarget from "./Component/Target/Addtarget";
import TargetDetails from "./Component/Target/Targetdetails";
import UpdateTarget from "./Component/Target/UpdateTarget";

import ScheduleHome from "./Component/Schedule/ScheduleHome";
import AddSchedule from "./Component/Schedule/AddSchedule";
import ScheduleDetails from "./Component/Schedule/ScheduleDetails";
import UpdateSchedule from "./Component/Schedule/UpdateSchedule";

function App() {
  const location = useLocation();

  // Check if the current page is employee side
  const isEmployeePage =
    location.pathname.startsWith("/employee-login") ||
    location.pathname.startsWith("/employee-dashboard");

  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar: show only if NOT employee pages */}
      {!isEmployeePage && (
        <div style={{ width: "220px", borderRight: "1px solid #ccc" }}>
          <DashboardNav />
        </div>
      )}

      {/* Employee Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/emplyeeAdmin-home" element={<DashboardHome />} />

          {/* Employee Pages */}
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

          {/* Admin Pages */}
          <Route path="/employeehome" element={<EmployeeHome />} />
          <Route path="/addemployee" element={<AddEmployee />} />
          <Route path="/employeedetails" element={<EmployeeDetails />} />
          <Route path="/updateemployee/:id" element={<UpdateEmployee />} />

          <Route path="/targethome" element={<TargetHome />} />
          <Route path="/addtarget" element={<AddTarget />} />
          <Route path="/targetdetails" element={<TargetDetails />} />
          <Route path="/updatetarget/:id" element={<UpdateTarget />} />

          <Route path="/schedulehome" element={<ScheduleHome />} />
          <Route path="/addschedule" element={<AddSchedule />} />
          <Route path="/scheduledetails" element={<ScheduleDetails />} />
          <Route path="/updateschedule/:id" element={<UpdateSchedule />} />

          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
