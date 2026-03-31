import {
  Search,
  CalendarDays,
  Users,
  Sun,
  Moon,
  Coffee,
  CalendarOff,
  LayoutDashboard,
  CalendarPlus,
  Loader2,
} from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import SelectField from "../../../components/ui/selectField";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  transformSchedule,
  getDaysInMonth,
  shiftCodeToId,
} from "../../../utils/transformSchedule";
import type { Department } from "../../../types/userType";
import { Loading } from "../../../components/ui/load";

// Internal components
import ShiftPalette from "../../../components/schedule/ShiftPalette";
import DepartmentStatusGrid from "../../../components/schedule/DepartmentStatusGrid";
import ScheduleGenerator from "../../../components/schedule/ScheduleGenerator";
import api from "../../../services/api";

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
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    years.push({ id: y, label: String(y) });
  }
  return years;
};

const YEAR_OPTIONS = generateYearOptions();

type TabType = "jadwal" | "status" | "buat";

const ScheduleListPage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [activeTab, setActiveTab] = useState<TabType>("jadwal");

  // Data states
  const [scheduleData, setScheduleData] = useState<any>([]);
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  const [employeeData, setEmployeeData] = useState<any[]>([]);

  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState<number | string>(
    "",
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchTerm, setSearchTerm] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Status check states
  const [scheduleOverview, setScheduleOverview] = useState<
    Record<number, boolean>
  >({});
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);

  // Drag and drop updating state mapping "employeeId-dayIndex" -> bool
  const [updatingCells, setUpdatingCells] = useState<Record<string, boolean>>(
    {},
  );

  // Fetch initial data
  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/departments`);
      const data = response.data.data.datas.data;
      setDepartmentData(data);
      if (data.length > 0 && !selectedDepartment) {
        setSelectedDepartment(data[0].id);
      }
    } catch (error) {
      console.error("fetching department error", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/employees`);
      const data = response.data.data.datas.data;
      setEmployeeData(data);
    } catch (error) {
      console.error("fetching employee error", error);
    }
  };

  const fetchSchedule = async (deptId: number | string) => {
    if (!deptId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/shift-schedules/${deptId}/details`,
      );
      const data = response.data.data.datas;
      setScheduleData(data);
    } catch (error) {
      console.error("fetching schedule error", error);
      setScheduleData([]);
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
    }
  };

  // Fetch overview of which departments have schedules
  const fetchScheduleOverview = async () => {
    if (departmentData.length === 0) return;
    setIsOverviewLoading(true);

    try {
      const overview: Record<number, boolean> = {};

      // Promise.all for parallel fetching
      await Promise.all(
        departmentData.map(async (dept) => {
          try {
            const res = await api.get(
              `${baseUrl}/api/shift-schedules/${dept.id}/details`,
            );
            const data = res.data.data.datas;
            const hasDataForPeriod = data.some((schedule: any) => {
              const date = new Date(schedule.start_date || schedule.created_at);
              return (
                date.getMonth() + 1 === selectedMonth &&
                date.getFullYear() === selectedYear
              );
            });
            overview[dept.id] = hasDataForPeriod;
          } catch {
            overview[dept.id] = false;
          }
        }),
      );

      setScheduleOverview(overview);
    } catch (err) {
      console.error("Error fetching overview", err);
    } finally {
      setIsOverviewLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchSchedule(selectedDepartment);
    }
  }, [selectedDepartment]);

  // Load overview whenever tab changes to status or date changes
  useEffect(() => {
    if (activeTab === "status") {
      fetchScheduleOverview();
    }
  }, [activeTab, selectedMonth, selectedYear, departmentData]);

  // Computed values
  const daysInMonth = useMemo(
    () => getDaysInMonth(selectedMonth, selectedYear),
    [selectedMonth, selectedYear],
  );

  const today = currentDate.getDate();
  const isCurrentMonthYear =
    selectedMonth === currentMonth && selectedYear === currentYear;

  const filteredByPeriod = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) return [];
    return scheduleData.filter((schedule: any) => {
      const date = new Date(schedule.schedule_date || schedule.created_at);
      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  }, [scheduleData, selectedMonth, selectedYear]);

  const shiftScheduleDetails =
    filteredByPeriod[0]?.shift_schedules_details ?? [];

  const employeeShift = useMemo(
    () => transformSchedule(shiftScheduleDetails, employeeData, daysInMonth),
    [shiftScheduleDetails, employeeData, daysInMonth],
  );

  const filteredSchedule = employeeShift.filter((item: any) => {
    return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  console.log(filteredSchedule);

  const stats = useMemo(() => {
    const totalEmployees = employeeShift.length;
    let pagi = 0,
    siang = 0,
    malam = 0,
      off = 0;
    const todayIndex = today - 1;

    employeeShift.forEach((emp: any) => {
      if (emp.shifts && emp.shifts[todayIndex]) {
        switch (emp.shifts[todayIndex]) {
          case "P":
            pagi++;
            break;
          case "S":
            siang++;
            break;
          case "M":
            malam++;
            break;
          case "O":
            off++;
            break;
        }
      }
    });

    return { totalEmployees, pagi, malam, siang, off };
  }, [employeeShift, today]);

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

  const getDayName = (day: number) => {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    const names = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return names[date.getDay()];
  };

  const isWeekend = (day: number) => {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const selectedDeptName = departmentData.find(
    (d) => d.id === Number(selectedDepartment),
  )?.department_name;
  const selectedMonthLabel = MONTH_OPTIONS[selectedMonth - 1]?.label || "";

  // Drag and Drop Logic
  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add(
      "bg-blue-soft/40",
      "scale-[1.05]",
      "shadow-inner",
    );
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove(
      "bg-blue-soft/40",
      "scale-[1.05]",
      "shadow-inner",
    );
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLTableCellElement>,
    employeeId: number,
    dayIndex: number,
    detailId: number | null,
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove(
      "bg-blue-soft/40",
      "scale-[1.05]",
      "shadow-inner",
    );

    const shiftCode = e.dataTransfer.getData("shiftCode");
    if (!shiftCode || !detailId) return;

    const shiftData = shiftCodeToId(shiftCode);
    const cellKey = `${employeeId}-${dayIndex}`;

    setUpdatingCells((prev) => ({ ...prev, [cellKey]: true }));

    try {
      await api.put(`/shift-schedule-details/${detailId}`, {
        shift_id: shiftData.shift_id,
        is_off: shiftData.is_off ? 1 : 0,
      });
      await fetchSchedule(selectedDepartment);

      e.currentTarget.classList.add("ring-2", "ring-green-400", "ring-inset");
      setTimeout(
        () =>
          e.currentTarget.classList.remove(
            "ring-2",
            "ring-green-400",
            "ring-inset",
          ),
        1500,
      );
    } catch (error) {
      console.error("Gagal update shift detail", error);
    } finally {
      setUpdatingCells((prev) => ({ ...prev, [cellKey]: false }));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-xl flex items-center gap-2">
            <CalendarDays size={24} className="text-blue-primary" />
            Manajemen Jadwal Shift
          </h1>
          <p className="opacity-60 text-sm mt-1">
            Kelola, buat, dan pantau jadwal shift Staff RSUD Dr. Faterino
            Hartono
          </p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="mt-4 flex bg-accent-foreground shadow w-fit p-1 rounded-xl ">
        <button
          onClick={() => setActiveTab("jadwal")}
          className={`flex w-fit items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "jadwal" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
        >
          <CalendarDays size={16} />
          Jadwal Shift
        </button>
        <button
          onClick={() => setActiveTab("status")}
          className={`flex w-fit items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "status" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
        >
          <LayoutDashboard size={16} />
          Status Departemen
        </button>
        <button
          onClick={() => setActiveTab("buat")}
          className={`flex w-fit items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "buat" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
        >
          <CalendarPlus size={16} />
          Buat Jadwal
        </button>
      </div>

      {/* Stats Summary (Only visible in Jadwal) */}
      {activeTab === "jadwal" &&
        isCurrentMonthYear &&
        hasInitialized &&
        employeeShift.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 animate-[fadeIn_0.4s_ease-out]">
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-light/50">
                <Users size={18} className="text-blue-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Staf</p>
                <p className="text-lg font-bold text-blue-dark">
                  {stats.totalEmployees}
                </p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Sun size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shift Pagi</p>
                <p className="text-lg font-bold text-green-700">{stats.pagi}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Sun size={18} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shift Siang</p>
                <p className="text-lg font-bold text-yellow-700">
                  {stats.siang}
                </p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Moon size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shift Malam</p>
                <p className="text-lg font-bold text-blue-700">{stats.malam}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Coffee size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Off / Libur</p>
                <p className="text-lg font-bold text-red-600">{stats.off}</p>
              </div>
            </div>
          </div>
        )}

      {/* Main Container */}
      <Card className="border-none mt-6 h-auto shadow-sm">
        {activeTab !== "buat" && (
          <CardHeader className="bg-slate-50/50 rounded-t-xl border-b border-border/80">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <SelectField
                  onChange={(e) => {
                    setSelectedMonth(Number(e.target.value));
                    if (activeTab === "status")
                      setTimeout(fetchScheduleOverview, 100);
                  }}
                  label="Bulan"
                  name="month"
                  options={MONTH_OPTIONS}
                  defaultValue={selectedMonth}
                />
                <SelectField
                  onChange={(e) => {
                    setSelectedYear(Number(e.target.value));
                    if (activeTab === "status")
                      setTimeout(fetchScheduleOverview, 100);
                  }}
                  label="Tahun"
                  name="year"
                  options={YEAR_OPTIONS}
                  defaultValue={selectedYear}
                />

                {activeTab === "jadwal" && (
                  <SelectField
                    onChange={(e) =>
                      setSelectedDepartment(Number(e.target.value))
                    }
                    label="Departemen"
                    name="department"
                    options={departmentData?.map((item) => ({
                      id: item.id,
                      label: item.department_name,
                    }))}
                    defaultValue={selectedDepartment}
                  />
                )}
              </div>

              {activeTab === "jadwal" && (
                <div className="flex w-full lg:w-80 self-end border border-border rounded-lg bg-white px-4 py-2.5 focus-within:ring-2 ring-blue-soft/50 transition-all">
                  <Search size={18} className="text-muted-foreground" />
                  <input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Cari karyawan..."
                    className="w-full h-full focus:outline-none ml-2 text-sm bg-transparent"
                  />
                </div>
              )}
            </div>
          </CardHeader>
        )}

        <CardContent className="w-full pt-6">
          {/* TAB 1: JADWAL SHIFT */}
          {activeTab === "jadwal" && (
            <div className="flex flex-col xl:flex-row items-start gap-6 animate-[slideIn_0.3s_ease-out]">
              {/* Left Column: Palette */}
              {filteredSchedule.length > 0 && !isLoading && (
                <div className="w-full xl:w-[200px] shrink-0 sticky top-24 z-20">
                  <ShiftPalette />
                  <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <h4 className="text-sm font-semibold text-blue-dark mb-1">
                      Cara Edit
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Tarik (drag) blok shift dari atas lalu lepas (drop) pada
                      sel jadwal untuk mengubah shift karyawan.
                    </p>
                  </div>
                </div>
              )}

              {/* Right Column: Table */}
              <div className="flex-1 w-full min-w-0">
                {isLoading && <Loading message="Memuat Jadwal...." />}

                {!isLoading &&
                  hasInitialized &&
                  filteredSchedule.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 animate-[fadeIn_0.3s_ease-out]">
                      <div className="p-4 rounded-full bg-blue-light/30 mb-4">
                        <CalendarOff
                          size={40}
                          className="text-blue-primary/50"
                        />
                      </div>
                      <p className="text-base font-semibold text-blue-dark">
                        Tidak Ada Jadwal
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 text-center max-w-md">
                        Belum ada data jadwal untuk{" "}
                        <span className="font-medium">
                          {selectedDeptName ?? "departemen ini"}
                        </span>{" "}
                        pada bulan{" "}
                        <span className="font-medium">
                          {selectedMonthLabel} {selectedYear}
                        </span>
                        . Silakan buat di tab Buat Jadwal.
                      </p>
                    </div>
                  )}

                {!isLoading && filteredSchedule.length > 0 && (
                  <div className="w-full overflow-x-auto border border-border rounded-lg animate-[fadeIn_0.3s_ease-out] shadow-sm">
                    <table className="min-w-[900px] w-full border-collapse text-sm">
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
                            const isToday = isCurrentMonthYear && day === today;
                            const weekend = isWeekend(day);
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
                            const isToday = isCurrentMonthYear && day === today;
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
                        {filteredSchedule.map((employee: any, i: number) => (
                          <tr
                            key={employee.employee_id}
                            className="hover:bg-blue-50/30 transition-colors group"
                          >
                            <td className="bg-white group-hover:bg-transparent border-r border-b border-border p-2 text-center text-slate-500 font-medium">
                              {i + 1}
                            </td>
                            <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/50 border-r border-b border-border p-2 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                              <p className="line-clamp-1 font-semibold text-blue-dark">
                                {employee.name}
                              </p>
                            </td>
                            {employee.shifts.map(
                              (shift: string, day: number) => {
                                const isToday =
                                  isCurrentMonthYear && day + 1 === today;
                                const detailId = employee.detailIds[day];
                                const cellKey = `${employee.employee_id}-${day}`;
                                const isUpdating = updatingCells[cellKey];

                                return (
                                  <td
                                    key={day}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) =>
                                      handleDrop(
                                        e,
                                        employee.employee_id,
                                        day,
                                        detailId,
                                      )
                                    }
                                    className={`
                                    ${shiftBackground(shift)} 
                                    border-r border-b border-border p-2 text-center font-bold text-xs
                                    transition-all duration-200 select-none
                                    ${isToday ? "ring-2 ring-inset ring-blue-primary/40" : ""}
                                    ${isUpdating ? "animate-pulse opacity-50 bg-slate-100" : ""}
                                    ${!isUpdating && detailId ? "cursor-alias hover:brightness-95 hover:shadow-inner" : "cursor-not-allowed opacity-50"}
                                  `}
                                    title={`${employee.name} — Hari ke-${day + 1}${detailId ? "" : " (No Detail ID)"}`}
                                  >
                                    {isUpdating ? (
                                      <Loader2
                                        size={12}
                                        className="animate-spin mx-auto text-blue-primary"
                                      />
                                    ) : (
                                      shift
                                    )}
                                  </td>
                                );
                              },
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!isLoading && filteredSchedule.length > 0 && (
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground w-full">
                    <p>
                      Menampilkan{" "}
                      <span className="font-semibold text-blue-dark">
                        {filteredSchedule.length}
                      </span>{" "}
                      dari{" "}
                      <span className="font-semibold text-blue-dark">
                        {employeeShift.length}
                      </span>{" "}
                      karyawan
                    </p>
                    <p>
                      {selectedMonthLabel} {selectedYear} — {daysInMonth} hari
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STATUS DEPARTEMEN */}
          {activeTab === "status" && (
            <div className="animate-[slideIn_0.3s_ease-out]">
              {isOverviewLoading ? (
                <Loading message="Memeriksa status departemen..." />
              ) : (
                <DepartmentStatusGrid
                  departments={departmentData}
                  employeeData={employeeData}
                  hasScheduleFn={(deptId) => scheduleOverview[deptId] || false}
                  monthLabel={selectedMonthLabel}
                  yearLabel={selectedYear}
                  onGenerateClick={(deptId) => {
                    setSelectedDepartment(deptId);
                    setActiveTab("buat");
                  }}
                  onViewClick={(deptId) => {
                    setSelectedDepartment(deptId);
                    setActiveTab("jadwal");
                  }}
                />
              )}
            </div>
          )}

          {/* TAB 3: BUAT JADWAL */}
          {activeTab === "buat" && (
            <div className="animate-[slideIn_0.3s_ease-out] py-4">
              <ScheduleGenerator
                departments={departmentData}
                monthOptions={MONTH_OPTIONS}
                yearOptions={YEAR_OPTIONS}
                currentMonth={selectedMonth}
                currentYear={selectedYear}
                onSuccess={(deptId, month, year) => {
                  setSelectedDepartment(deptId);
                  setSelectedMonth(month);
                  setSelectedYear(year);
                  setActiveTab("jadwal");
                  // Optional: maybe trigger confetti globally
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ScheduleListPage;
