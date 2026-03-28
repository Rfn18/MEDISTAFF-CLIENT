import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/LoginPage";
import { Register } from "./pages/auth/RegisterPage";
import Dashboard from "./pages/admin/DashboardPage";
import "./App.css";
import ManagementPage from "./pages/admin/ManagementPage";
import ScheduleListPage from "./pages/admin/schedule/ScheduleListPage";
import RequestSchedule from "./pages/admin/schedule/RequestSchedule";
import DashboardPage from "./pages/staff/DashboardPage";
import LeaveAgreementPage from "./pages/admin/LeaveAgreementPage";
import LeaveRequestPage from "./pages/staff/LeaveRequestPage";
import AdminMiddleware from "./middleware/AdminMiddleware";
import StaffMiddleware from "./middleware/StaffMiddleware";
import NotFound from "./pages/Unauthorized";
import Unauthorized from "./pages/Unauthorized";
import AttendancePage from "./pages/admin/attendance/AttendancePage";
import QRCodePage from "./pages/staff/attendance/QRCodePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AdminMiddleware />}>
          {/* Admin */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/management" element={<ManagementPage />} />
          {/* Schedule */}
          <Route path="/admin/jadwal-shift" element={<ScheduleListPage />} />
          <Route path="/admin/request-shift" element={<RequestSchedule />} />
          <Route
            path="/admin/persetujuan-cuti"
            element={<LeaveAgreementPage />}
          />
          <Route path="/admin/absensi" element={<AttendancePage />} />
        </Route>

        <Route element={<StaffMiddleware />}>
          {/* Staff */}
          <Route path="/staff/dashboard" element={<DashboardPage />} />
          <Route path="/staff/pengajuan-cuti" element={<LeaveRequestPage />} />
          <Route path="/staff/absensi" element={<QRCodePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
