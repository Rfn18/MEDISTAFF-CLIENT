import {
  ChevronLeft,
  ChevronRight,
  BarChart2,
  CalendarDays,
  Clock,
  ShieldAlert,
} from "lucide-react";
import Layout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import type { CardItem } from "../../types/card";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import type { Attendance, AttendanceSummary } from "../../types/attendanceType";
import { useEffect, useState } from "react";
import api from "../../services/api";
import SelectField from "../../components/ui/selectField";
import { AttendanceTableUser } from "../../components/attendance/Attendance";
import { Loading } from "../../components/ui/load";

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

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.employee?.full_name || user?.name || "Employee";
  const [attendanceSummaries, setAttendanceSummaries] =
    useState<AttendanceSummary>();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [isAttendacesExist, setIsAttendacesExist] = useState(false);

  const fetchAttendanceSummaries = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`/summarise`, {
        employee_id: user?.employee_id,
        month: month,
        year: year,
      });
      const data = response.data.data.datas;
      setAttendanceSummaries(data);
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`/attendance-by-month`, {
        month: month,
        year: year,
      });
      const data = response.data.data.datas;
      setAttendance(data);
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!user) return;
    setAttendanceSummaries(undefined);
    setAttendance([]);
    setIsAttendacesExist(false);
    fetchAttendanceSummaries();
    fetchAttendance();
  }, [month, year]);

  const totalLate = Number(attendanceSummaries?.total_late);
  const totalSick = Number(attendanceSummaries?.total_sick);
  const totalAbsent = Number(attendanceSummaries?.total_absent);
  const totalPresent = Number(attendanceSummaries?.total_present);
  const totalWorkingDays = totalPresent + totalAbsent + totalSick + totalLate;
  const percentage = (totalPresent / totalWorkingDays) * 100;

  const cardItem: CardItem[] = [
    {
      id: 1,
      title: "Hari Bekerja",
      amount: totalWorkingDays,
      icon: CalendarDays,
    },
    {
      id: 2,
      title: "Persentase Absensi",
      amount: Number(percentage.toFixed(2)),
      icon: BarChart2,
    },
    {
      id: 3,
      title: "Total Terlambat",
      amount: totalLate,
      icon: Clock,
    },
    {
      id: 4,
      title: "Total Izin",
      amount: totalSick,
      icon: ShieldAlert,
    },
  ];

  useEffect(() => {
    if (attendance.length > 0 && attendanceSummaries) {
      setIsAttendacesExist(true);
    } else {
      setIsAttendacesExist(false);
    }
  }, [attendance, attendanceSummaries]);

  return (
    <Layout>
      <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto font-sans text-blue-dark bg-[#F8FAFC] animate-[fadeIn_0.3s_ease-out]">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl  text-blue-dark">
              Welcome back, <span className="font-bold">{userName}</span>
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2 font-medium">
              <CalendarDays size={18} className="text-[#0062FF]" />{" "}
              {MONTH_OPTIONS[month - 1].label} {year} Recap
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <SelectField
              onChange={(e) => {
                setMonth(Number(e.target.value));
              }}
              label="Bulan"
              name="month"
              options={MONTH_OPTIONS}
              defaultValue={month}
            />
            <SelectField
              onChange={(e) => {
                setYear(Number(e.target.value));
              }}
              label="Tahun"
              name="year"
              options={YEAR_OPTIONS}
              defaultValue={year}
            />
          </div>
        </div>

        {isAttendacesExist && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:auto-cols-max lg:grid-cols-4 gap-4 w-full animate-[fadeIn_0.3s_ease-out]">
            {cardItem.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  className="flex items-center justify-start gap-4 min-w-60 border-none py-6 px-0 pl-10"
                >
                  <CardHeader className="border-none m-0 p-0">
                    <div className="p-2 flex items-center justify-center w-12 h-12 rounded bg-primary/10">
                      <Icon className="text-blue-dark" />
                    </div>
                  </CardHeader>
                  <CardContent className="border-none m-0 p-0">
                    <p className="text-blue-dark/60 text-sm">{item.title}</p>
                    <p className="text-2xl font-bold text-blue-dark">
                      {item.amount}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {/* Detailed Log Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 sm:p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-dark">
              Riwayat Absensi
            </h2>
          </div>

          <div className="w-full overflow-x-auto">
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center w-full py-16">
                  <Loading message="Memuat absensi..." />
                </div>
              ) : attendance.length > 0 ? (
                <AttendanceTableUser data={attendance} />
              ) : (
                <div className="flex flex-col items-center justify-center w-full py-16">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-blue-primary/60" />
                  </div>
                  <p className="text-lg font-bold text-blue-dark">
                    Belum ada data absensi
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Saat ini tidak ada data absensi yang perlu ditinjau.
                  </p>
                </div>
              )}
            </CardContent>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
            <span className="px-2">Showing 1 to 8 of 22 entries</span>
            <div className="flex gap-2">
              <button
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 hover:border-[#0062FF] hover:text-[#0062FF] bg-white transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-[#0062FF] text-white font-semibold transition-colors"
                aria-label="Page 1"
              >
                1
              </button>
              <button
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 hover:border-[#0062FF] hover:text-[#0062FF] bg-white transition-colors"
                aria-label="Page 2"
              >
                2
              </button>
              <button
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 hover:border-[#0062FF] hover:text-[#0062FF] bg-white transition-colors"
                aria-label="Page 3"
              >
                3
              </button>
              <button
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 hover:border-[#0062FF] hover:text-[#0062FF] bg-white transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
