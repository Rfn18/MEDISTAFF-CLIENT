import { HardHat, Loader2, PenBox, Stethoscope, Users } from "lucide-react";
import Layout from "../../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import type { CardItem } from "../../types/card";
import { useEffect, useState } from "react";
import type { Employee, LeaveRequest, Department } from "../../types/userType";
import api from "../../services/api";
import AttendanceDashboard from "../../components/dashboard/AttendanceDashboard";
import { EmployeeTableDashboard } from "../../components/dashboard/dashboardTable";
import { CardSkeleton, TableSkeleton } from "../../components/ui/skeletonLoad";

const Dashboard = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [shift, setShift] = useState([]);
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest[]>([]);
  const [scheduleToday, setScheduleToday] = useState([]);

  const [loading, setLoading] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      // employee
      setLoading(true);
      const responseEmployee = await api.get(`/employees`);
      const dataEmployee = responseEmployee.data.data.datas.data;
      setEmployee(dataEmployee);

      // department
      const responseDepartment = await api.get(`/departments`);
      const dataDepartment = responseDepartment.data.data.datas.data;
      setDepartment(dataDepartment);

      // shift
      const responseShift = await api.get(`/shifts`);
      const dataShift = responseShift.data.data.datas.data;
      setShift(dataShift);

      // leave-request
      const responseLeaveRequest = await api.get(`/leave-requests`);
      const dataLeaveRequest = responseLeaveRequest.data.data.datas.data;
      setLeaveRequest(dataLeaveRequest);

      // schedule-today
      const responseScheduleToday = await api.get(
        `/shift-schedule-details/today`,
      );
      const dataScheduleToday = responseScheduleToday.data.data.datas.data;
      setScheduleToday(dataScheduleToday);
    } catch (error) {
      console.error("Failed fetching data.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const countEmployee = () => {
    return employee?.length ? employee.length : 0;
  };

  const countLeaveRequestPending = () => {
    return leaveRequest.filter((item) => item.status === "pending").length;
  };

  const cardItem: CardItem[] = [
    {
      id: 1,
      title: "Total Karyawan",
      amount: countEmployee(),
      icon: Users,
    },
    {
      id: 2,
      title: "Staff Medis",
      amount: employee.filter((item) => item.position_id === 2).length || 0,
      icon: Stethoscope,
    },
    {
      id: 3,
      title: "Staff Non-Medis",
      amount: employee.filter((item) => item.position_id !== 2).length || 0,
      icon: HardHat,
    },
    {
      id: 4,
      title: "Izin Hari Ini (Pending)",
      amount: countLeaveRequestPending(),
      icon: PenBox,
    },
  ];

  return (
    <Layout>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {loading ? (
          <CardSkeleton rows={4} />
        ) : (
          cardItem.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className="flex items-center gap-4 border-none p-6 transition hover:shadow-md hover:scale-[1.02]"
              >
                <CardHeader className="p-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Icon className="text-blue-dark" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-blue-dark/60 text-sm">{item.title}</p>
                  <p className="text-2xl font-bold text-blue-dark">
                    {item.amount}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Attendance Dashboard */}
      <div className="mt-6">
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Attendance Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceDashboard />
          </CardContent>
        </Card>
      </div>

      {/* Attendance log for 1 month*/}
      <div className="mt-6">
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-xl">Attendance Log</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton rows={5} />
            ) : (
              <EmployeeTableDashboard data={employee} />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
