import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  Users,
  CalendarDays,
  ChevronDown,
  X,
  RefreshCw,
  UserCheck,
  Timer,
  ArrowDownUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import type { Attendance, StatusFilter } from "../../types/attendanceType";
import type { Department, Employee } from "../../types/userType";
import formatTime from "../../utils/formatTime";

export default function AttendanceDashboard() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Data states
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttendanceToday = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendances/today");

      setAttendances(res.data.data?.datas?.data ?? res.data.data ?? []);
    } catch (error) {
      console.error("Failed fetching attendance data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceComponents = async () => {
    try {
      const [deptRes, empRes] = await Promise.all([
        api.get("/departments"),
        api.get("/employees"),
      ]);

      setDepartments(deptRes.data.data?.datas?.data ?? []);
      setEmployees(empRes.data.data?.datas?.data ?? []);
    } catch (error) {
      console.error("Failed fetching attendance components", error);
    }
  };

  useEffect(() => {

    fetchAttendanceComponents()
    fetchAttendanceToday();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceToday();
    setTimeout(() => setRefreshing(false), 600);
  };

  // Helpers
  const getEmployee = (employeeId: number) =>
    employees.find((e) => e.id === employeeId);

  const getDepartmentName = (att: Attendance) => {
    const emp = att.employee ?? getEmployee(att.employee_id);
    if (emp?.department?.department_name) return emp.department.department_name;
    const dept = departments.find((d) => d.id === emp?.department_id);
    return dept?.department_name ?? "-";
  };

  const getEmployeeName = (att: Attendance) => {
    const emp = att.employee ?? getEmployee(att.employee_id);
    return emp?.full_name ?? "-";
  };

  const getEmployeePhoto = (att: Attendance) => {
    const emp = att.employee ?? getEmployee(att.employee_id);
    return emp?.photo ?? null;
  };

  const getEmployeeNip = (att: Attendance) => {
    const emp = att.employee ?? getEmployee(att.employee_id);
    return emp?.nip ?? "-";
  };

  const getEmployeePosition = (att: Attendance) => {
    const emp = att.employee ?? getEmployee(att.employee_id);
    return emp?.position?.position_name ?? "-";
  };

  // Status helpers
  const resolveStatus = (att: Attendance): StatusFilter => {
    if (att.status === "present") return "present";
    if (att.status === "late") return "late";
    return "checked-in";
  };

  // Summary counts
  const summary = useMemo(() => {
    let present = 0;
    let late = 0;
    let checkedIn = 0;

    attendances.forEach((att) => {
      const s = resolveStatus(att);
      if (s === "present") present++;
      else if (s === "late") late++;
      else checkedIn++;
    });

    return { total: attendances.length, present, late, checkedIn };
  }, [attendances]);

  // Filtered data
  const filteredAttendances = useMemo(() => {
    return attendances.filter((att) => {
      // Department filter
      if (selectedDepartment !== "all") {
        const deptName = getDepartmentName(att);
        if (deptName !== selectedDepartment) return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        const status = resolveStatus(att);
        if (status !== statusFilter) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = getEmployeeName(att).toLowerCase();
        const nip = getEmployeeNip(att).toLowerCase();
        const dept = getDepartmentName(att).toLowerCase();
        if (!name.includes(q) && !nip.includes(q) && !dept.includes(q))
          return false;
      }

      return true;
    });
  }, [
    attendances,
    selectedDepartment,
    statusFilter,
    searchQuery,
    employees,
    departments,
  ]);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const clearAllFilters = () => {
    setSelectedDepartment("all");
    setStatusFilter("all");
    setSearchQuery("");
  };

  const handleChangeStatus = (e) => {
    setStatusFilter(e.target.value);
  }

  // Status badge
  const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      present: {
        bg: "bg-emerald-50 border-emerald-200",
        text: "text-emerald-700",
        icon: <CheckCircle2 size={12} />,
        label: "Hadir",
      },
      late: {
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-700",
        icon: <AlertTriangle size={12} />,
        label: "Terlambat",
      },
      "checked-in": {
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-700",
        icon: <LogIn size={12} />,
        label: "Check-In",
      },
    };

    const resolved = status === "present" ? "present" : status === "late" ? "late" : "checked-in";
    const c = config[resolved];

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}
      >
        {c.icon}
        {c.label}
      </span>
    );
  };
  

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Table skeleton */}
        <div className="bg-white rounded-xl border border-border p-6 animate-pulse">
          <div className="h-5 bg-primary/10 rounded w-48 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-primary/10 rounded w-3/4" />
                  <div className="h-2 bg-primary/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-blue-dark flex items-center gap-2">
            <CalendarDays size={22} className="text-blue-primary" />
            Absensi Hari Ini
          </h2>
          <p className="text-sm text-blue-dark/50 mt-0.5">{today}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-primary bg-blue-primary/5 hover:bg-blue-primary/10 border border-blue-primary/20 rounded-lg transition-all duration-200 cursor-pointer group"
        >
          <RefreshCw
            size={15}
            className={`transition-transform duration-500 ${
              refreshing ? "animate-spin" : "group-hover:rotate-90"
            }`}
          />
          Refresh
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-dark/30"
            />
            <input
              id="search-employee"
              type="text"
              placeholder="Cari karyawan berdasarkan nama, NIP, atau departemen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-background text-blue-dark placeholder:text-blue-dark/30 focus:outline-none focus:ring-2 focus:ring-blue-primary/20 focus:border-blue-primary/40 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-dark/30 hover:text-blue-dark/60 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Department Filter */}
        <select className="text-sm border-border border rounded-md p-2 focus:outline-none">
          <option value="all">Semua Departemen</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.department_name}>
              {dept.department_name}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={handleChangeStatus} name="status" id="status" className="text-sm border-border border rounded-md p-2 focus:outline-none">
          <option value="all">Semua Status</option>
          <option value="present">Hadir</option>
          <option value="late">Terlambat</option>
          <option value="checked-in">Check-In</option>
        </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-blue-primary" />
            <h3 className="font-semibold text-blue-dark">
              Daftar Kehadiran
            </h3>
            <span className="ml-1 px-2 py-0.5 text-xs font-medium text-blue-primary bg-blue-primary/10 rounded-full">
              {filteredAttendances.length} karyawan
            </span>
          </div>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead>
              <tr className="bg-background/60">
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3">
                  #
                </th>
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3">
                  Karyawan
                </th>
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3">
                  Departemen
                </th>
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3">
                  Jabatan
                </th>
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Check-In
                  </span>
                </th>
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Check-Out
                  </span>
                </th>
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3">
                  Status
                </th>
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3">
                  Keterlambatan
                </th>
                <th className="font-semibold uppercase tracking-wider text-[11px] text-blue-dark/50 px-6 py-3 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-16 text-blue-dark/40"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-blue-light/50 flex items-center justify-center">
                        <Users size={28} className="text-blue-primary/40" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-dark/60">
                          Tidak ada data kehadiran
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((att, index) => {
                  const name = getEmployeeName(att);
                  const photo = getEmployeePhoto(att);
                  const nip = getEmployeeNip(att);
                  const deptName = getDepartmentName(att);
                  const position = getEmployeePosition(att);

                  return (
                    <tr
                      key={att.id}
                      className="hover:bg-blue-light/15 transition-colors duration-150 group"
                      style={{
                        animation: `fadeIn 0.3s ease ${index * 0.03}s both`,
                      }}
                    >
                      <td className="px-6 py-4 text-blue-dark/40 text-xs font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <img
                              src={`${baseUrl}/storage/employee/${photo}`}
                              alt={name}
                              className="w-9 h-9 rounded-full object-cover object-center ring-2 ring-border"
                            />
                          ) : (
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                name || "User"
                              )}&background=cce3de&color=03045e&size=36`}
                              alt={name}
                              className="w-9 h-9 rounded-full ring-2 ring-border"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-blue-dark truncate">
                              {name}
                            </p>
                            <p className="text-xs text-blue-dark/40 truncate">
                              {nip}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-blue-dark/70">
                          {deptName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-blue-dark/70">
                          {position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-blue-dark">
                          {att.check_in_time
                            ? formatTime(att.check_in_time)
                            : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-blue-dark/70">
                          {att.check_out_time
                            ? formatTime(att.check_out_time)
                            : (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-dark/30">
                                <Timer size={11} />
                                Belum
                              </span>
                            )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={att.status} />
                      </td>
                      <td className="px-6 py-4">
                        {att.late_minutes && att.late_minutes > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Timer size={11} />
                            {att.late_minutes} menit
                          </span>
                        ) : (
                          <span className="text-xs text-blue-dark/30">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/karyawan/${att.employee_id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white auth-gradient rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-sm shadow-blue-primary/20"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filteredAttendances.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-background/40 border-t border-border/50">
            <p className="text-xs text-blue-dark/40">
              Menampilkan {filteredAttendances.length} dari{" "}
              {attendances.length} data kehadiran
            </p>
            <p className="text-xs text-blue-dark/40">
              Terakhir diperbarui:{" "}
              {new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
