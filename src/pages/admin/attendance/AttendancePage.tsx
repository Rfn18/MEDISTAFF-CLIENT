import { Box, Clock, ClockCheck, Search } from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import SelectField from "../../../components/ui/selectField";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import type { Department } from "../../../types/userType";
import { AttendanceTable } from "../../../components/attendance/Attendance";
import type { Attendance } from "../../../types/attendanceType";
import { Paginate } from "../../../components/ui/paginate";

const AttendancePage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [departmenData, setDepartmentData] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [totalData, setTotalData] = useState(0);
  const fetchAttendance = async () => {
    try {
      const response = await api.get(
        `/attendances?page=${pagination.current_page}`,
      );
      const data = response.data.data.datas.data;
      setAttendanceData(data);
      setTotalData(response.data.data.datas.total);
      setPagination({
        current_page: response.data.data.datas.current_page,
        last_page: response.data.data.datas.last_page,
      });
    } catch (error) {
      console.error("fetching attendance error", error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await api.get(`/departments`);
      const data = response.data.data.datas.data;
      setDepartmentData(data);
      if (data.length > 0 && !selectedDepartment) {
        setSelectedDepartment(data[0].id);
      }
    } catch (error) {
      console.error("fetching department error", error);
    }
  };

  useEffect(() => {
    fetchDepartment();
    fetchAttendance();
  }, []);

  const handleOpen = (row: Attendance) => {
    setSelectedAttendance(row);
    setOpen(true);
  };

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
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-xl flex items-center gap-2">
            <ClockCheck size={24} className="text-blue-primary" />
            List Absensi
          </h1>
          <p className="opacity-60 text-sm mt-1">
            List absensi karyawan RSUD Dr. Faterino Hartono
          </p>
        </div>
      </div>
      <Card className="border-none mt-6 h-auto shadow-sm">
        <CardHeader className="bg-slate-50/50 rounded-t-xl border-b border-border/80">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <SelectField label="Bulan" name="month" options={MONTH_OPTIONS} />
              <SelectField label="Tahun" name="year" options={YEAR_OPTIONS} />

              <SelectField
                //    onChange={(e) =>
                //      setSelectedDepartment(Number(e.target.value))
                //    }
                label="Departemen"
                name="department"
                options={departmenData?.map((item) => ({
                  id: item.id,
                  label: item.department_name,
                }))}
                defaultValue={selectedDepartment}
              />
            </div>
            <div className="flex w-full lg:w-80 self-end border border-border rounded-lg bg-white px-4 py-2.5 focus-within:ring-2 ring-blue-soft/50 transition-all">
              <Search size={18} className="text-muted-foreground" />
              <input
                //  onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Cari karyawan..."
                className="w-full h-full focus:outline-none ml-2 text-sm bg-transparent"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {attendanceData.length > 0 ? (
            <AttendanceTable data={attendanceData} onOpen={handleOpen} />
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
        {attendanceData.length > 0 && (
          <Paginate
            data={attendanceData}
            totalData={totalData}
            paginateData={pagination}
            setPaginateData={setPagination}
          />
        )}
      </Card>
    </Layout>
  );
};

export default AttendancePage;
