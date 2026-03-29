import {
  CalendarDays,
  Sun,
  Moon,
  Coffee,
  CalendarOff,
  Filter,
} from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { useEffect, useMemo, useState } from "react";
import {
  transformSchedule,
  getDaysInMonth,
} from "../../../utils/transformSchedule";
import { Loading } from "../../../components/ui/load";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";
import { SHIFT_LEGEND } from "../../../components/schedule/ShiftPalette";

const MONTH_OPTIONS = [
  { id: 1, label: "Januari" },
  { id: 2, label: "Februari" },
  { id: 3, label: "Maret" },
  { id: 4, label: "April" },
  { id: 5, label: "Mei" },
  { id: 6, label: "Juni" },
  { id: 7, label: "Juli" },
  { id: 8, label: "Agustus" },
  { id: 9, label: "September" },
  { id: 10, label: "Oktober" },
  { id: 11, label: "November" },
  { id: 12, label: "Desember" },
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

const generateYearOptions = () => {
  const years = [];
  for (let y = currentYear - 2; y <= currentYear + 1; y++) {
    years.push({ id: y, label: String(y) });
  }
  return years;
};

const YEAR_OPTIONS = generateYearOptions();

const StaffSchedulePage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();

  // Data states
  const [scheduleData, setScheduleData] = useState<any>([]);
  const [employeeData, setEmployeeData] = useState<any[]>([]);

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // UI states
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data
  const fetchEmployees = async () => {
    try {
      const response = await api.get(`${baseUrl}/api/employees`);
      const data = response.data?.data?.datas?.data || response.data?.data;
      setEmployeeData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetching employee error", error);
    }
  };

  const fetchSchedule = async (deptId: number | string) => {
    if (!deptId) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/shift-schedules/${deptId}/details`);
      const data = response.data?.data?.datas || response.data?.data;
      setScheduleData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetching schedule error", error);
      setScheduleData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const departmentId = employeeData?.find(
    (emp) => emp.id === user?.employee_id,
  )?.department_id;

  useEffect(() => {
    fetchEmployees();
  }, [baseUrl]);

  useEffect(() => {
    if (departmentId) {
      fetchSchedule(departmentId);
    } else {
      const flatDept = user?.department_id;
      if (flatDept) fetchSchedule(flatDept);
    }
  }, [departmentId, user, baseUrl]);

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  const filteredByPeriod = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) return [];
    return scheduleData.filter((schedule: any) => {
      const date = new Date(schedule.schedule_date);
      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  }, [scheduleData, selectedMonth, selectedYear]);

  const transformedData = useMemo(() => {
    if (!employeeData.length || !filteredByPeriod.length) return [];

    return transformSchedule(
      filteredByPeriod[0].shift_schedules_details,
      employeeData,
      daysInMonth,
    );
  }, [filteredByPeriod, employeeData, daysInMonth]);

  const getDayName = (dayIndex: number) => {
    const date = new Date(selectedYear, selectedMonth - 1, dayIndex);
    return date.toLocaleDateString("id-ID", { weekday: "short" });
  };

  const isToday = (dayIndex: number) => {
    return (
      dayIndex === currentDate.getDate() &&
      selectedMonth === currentDate.getMonth() + 1 &&
      selectedYear === currentDate.getFullYear()
    );
  };

  const isWeekend = (dayIndex: number) => {
    const day = new Date(selectedYear, selectedMonth - 1, dayIndex).getDay();
    return day === 0 || day === 6;
  };

  const shiftBackground = (shift: string) => {
    switch (shift) {
      case "P":
        return "bg-green-500/60 text-green-800";
      case "M":
        return "bg-blue-500/60 text-blue-800";
      case "S":
        return "bg-yellow-500/60 text-yellow-800";
      case "O":
        return "bg-red-500/60 text-red-800";
      default:
        return "bg-background text-foreground";
    }
  };

  return (
    <Layout>
      <div className="w-full flex-col flex gap-8 animate-[slideIn_0.3s_ease-out]">
        {/* Header Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-blue-dark flex items-center gap-3">
            <CalendarDays className="text-blue-primary" size={28} />
            Jadwal Shift
            <span className="opacity-80 font-normal">
              {user?.employee?.department?.department_name || ""}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Jadwal shift karyawan, jangan ada yang bolong!
          </p>
        </div>

        {/* Main Table Card */}
        <Card className="border border-border shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-border/60 bg-slate-50/50">
            <div className="flex items-center gap-3 text-blue-dark mb-4 sm:mb-0">
              <div className="">
                <div className="flex gap-2">
                  {SHIFT_LEGEND.map((shift) => (
                    <div
                      key={shift.code}
                      className={`flex items-center gap-3 p-1 px-2 rounded-lg border border-transparent ${shift.softBg}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center ${shift.color} ${shift.textColor} shadow`}
                      >
                        {shift.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-blue-dark leading-none">
                          {shift.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Kode: {shift.code}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <select
                className="w-full sm:w-40 px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-blue-soft appearance-none min-h-[42px]"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(Number(e.target.value));
                }}
              >
                {MONTH_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                className="w-full sm:w-32 px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-blue-soft appearance-none min-h-[42px]"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {YEAR_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>

          <div className="flex-1 w-full min-w-0">
            {isLoading && <Loading message="Memuat Jadwal...." />}

            {!isLoading && transformedData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 animate-[fadeIn_0.3s_ease-out]">
                <div className="p-4 rounded-full bg-blue-light/30 mb-4">
                  <CalendarOff size={40} className="text-blue-primary/50" />
                </div>
                <p className="text-base font-semibold text-blue-dark">
                  Tidak Ada Jadwal
                </p>
                <p className="text-sm text-muted-foreground mt-1 text-center max-w-md">
                  Belum ada data jadwal pada
                  <span className="font-medium">
                    {" "}
                    bulan {MONTH_OPTIONS[selectedMonth - 1].label}{" "}
                    {selectedYear}
                  </span>
                </p>
              </div>
            )}

            {!isLoading && transformedData.length > 0 && (
              <div className="flex justify-center">
                <div className="m-4 overflow-x-auto border border-border rounded-lg animate-[fadeIn_0.3s_ease-out] shadow-sm">
                  <table className="min-w-[900px] w-full border-collapse text-sm ">
                    <thead className="bg-slate-50 text-blue-dark text-sm border-b border-border">
                      <tr>
                        <th
                          rowSpan={2}
                          className="bg-slate-50 border-r border-border p-2 w-12 font-semibold"
                        >
                          No
                        </th>
                        <th
                          rowSpan={2}
                          className="sticky left-0 z-10 bg-slate-50 border-r border-border p-2 min-w-[180px] text-left font-semibold shadow-[2px_0_5px_rgba(0,0,0,0.02)]"
                        >
                          Nama
                        </th>
                        {[...Array(daysInMonth)].map((_, i) => {
                          const day = i + 1;
                          const weekend = isWeekend(day);
                          const isToday = day === currentDate.getDate();
                          return (
                            <th
                              key={i}
                              className={`p-1 border-r border-border text-center min-w-[44px] text-[10px] font-normal ${isToday ? "bg-blue-primary/10 border-b-2" : ""} ${weekend ? "text-red-500" : "text-slate-500"}`}
                            >
                              {getDayName(day)}
                            </th>
                          );
                        })}
                      </tr>
                      <tr>
                        {[...Array(daysInMonth)].map((_, i) => {
                          const day = i + 1;
                          const isToday = day === currentDate.getDate();
                          const weekend = isWeekend(day);
                          return (
                            <th
                              key={i}
                              className={`p-2 border-r border-border text-center min-w-[44px] font-bold ${isToday ? "bg-blue-primary/10 text-blue-primary" : ""} ${weekend && !isToday ? "text-red-500" : "text-slate-700"}`}
                            >
                              {isToday ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-primary text-white text-xs shadow-sm">
                                  {day}
                                </span>
                              ) : (
                                day
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>

                    <tbody>
                      {transformedData.map((employee: any, i: number) => (
                        <tr
                          key={employee.employee_id}
                          className="hover:bg-blue-50/30 transition-colors group"
                        >
                          {/* Nomor */}
                          <td className="bg-white group-hover:bg-transparent border-r border-b border-border p-2 text-center text-slate-500 font-medium">
                            {i + 1}
                          </td>

                          {/* Nama */}
                          <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/50 border-r border-b border-border p-2 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                            <p className="line-clamp-1 font-semibold text-blue-dark">
                              {employee.name}
                            </p>
                          </td>

                          {/* Shifts */}
                          {employee.shifts.map((shift: string, day: number) => {
                            const days = day + 1;
                            const isToday = days === currentDate.getDate();

                            return (
                              <td
                                key={day}
                                className={`
                                  ${shiftBackground(shift)}
                                    border-r border-b border-border p-2 text-center font-bold text-xs
                                    transition-all duration-200 select-none
                                    ${isToday ? "ring-2 ring-inset ring-blue-primary/40" : ""}
                                    `}
                                title={`${employee.name}`}
                              >
                                {shift}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isLoading && transformedData.length > 0 && (
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground m-4">
                <p>
                  Menampilkan{" "}
                  <span className="font-semibold text-blue-dark">
                    {transformedData.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-blue-dark">
                    {transformedData.length}
                  </span>{" "}
                  karyawan
                </p>
                <p>
                  {selectedMonth} {selectedYear} — {daysInMonth} hari
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default StaffSchedulePage;
