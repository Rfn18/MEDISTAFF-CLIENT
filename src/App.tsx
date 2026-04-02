import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import ScanPage from "./pages/admin/attendance/ScanPage";
import StaffSchedulePage from "./pages/staff/schedule/StaffSchedulePage";
import ProfilePage from "./pages/shared/ProfilePage";
import EmployeeProfileAdmin from "./pages/admin/management/EmployeeProfileAdmin";
import FluxAdminDashboard from "./pages/admin/attendance/FluxAdminDashboard";
import FluxEmployeeDashboard from "./pages/staff/attendance/FluxEmployeeDashboard";
import StaffPayrollPage from "./pages/staff/PayrollPage";
import PayrollPage from "./pages/admin/payroll/PayrollPage";
import PayrollComponent from "./pages/admin/payroll/PayrollComponent";
import { useAuth } from "./context/AuthContext";

function App() {
  const {user} = useAuth();
  return (
    <BrowserRouter>
      <Routes>
       {user ? (
          <>
            {user.role_id === 2 ? (
              <>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/login" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/register" element={<Navigate to="/admin/dashboard" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/staff/dashboard" replace />} />
                <Route path="/login" element={<Navigate to="/staff/dashboard" replace />} />
                <Route path="/register" element={<Navigate to="/staff/dashboard" replace />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        <Route element={<AdminMiddleware />}>
          {/* Admin */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/profil" element={<ProfilePage />} />
          <Route path="/admin/management" element={<ManagementPage />} />
          <Route
            path="/admin/karyawan/:id"
            element={<EmployeeProfileAdmin />}
          />
          {/* Schedule */}
          <Route path="/admin/jadwal-shift" element={<ScheduleListPage />} />
          <Route path="/admin/request-shift" element={<RequestSchedule />} />
          <Route
            path="/admin/persetujuan-cuti"
            element={<LeaveAgreementPage />}
          />
          {/* Attendance */}
          <Route path="/admin/absensi" element={<AttendancePage />} />
          <Route path="/admin/scan-absensi" element={<ScanPage />} />
          <Route
            path="/admin/flux-attendance"
            element={<FluxAdminDashboard />}
          />

          {/* Payroll */}
          <Route path="/admin/gaji" element={<PayrollPage />} />
          <Route path="/admin/komponen-gaji" element={<PayrollComponent />} />
        </Route>

        <Route element={<StaffMiddleware />}>
          {/* Staff */}
          <Route path="/staff/dashboard" element={<DashboardPage />} />
          <Route path="/staff/profil" element={<ProfilePage />} />
          <Route path="/staff/jadwal-shift" element={<StaffSchedulePage />} />
          <Route path="/staff/pengajuan-cuti" element={<LeaveRequestPage />} />
          <Route path="/staff/absensi" element={<QRCodePage />} />
          <Route
            path="/staff/flux-attendance"
            element={<FluxEmployeeDashboard />}
          />
          <Route path="/staff/gaji" element={<StaffPayrollPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
