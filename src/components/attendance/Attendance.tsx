import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Attendance } from "../../types/attendanceType";
import type { Department, Employee } from "../../types/userType";
import DataTable from "../ui/dataTable";
import formatTime from "../../utils/formatTime";
import { Link } from "react-router-dom";

type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  onEdit?: (row: T) => void;
  onActivate?: (row: T) => void;
};

export function AttendanceTable({ data }: { data: Attendance[] }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`${baseUrl}/api/employees`);
      const data = response?.data.data.datas.data;
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await api.get(`${baseUrl}/api/departments`);
      const data = response?.data.data.datas.data;
      setDepartment(data);
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchDepartment();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "late":
        return "bg-red-50 text-red-600 border-red-200";
      case "present":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "late":
        return "Terlambat";
      case "present":
        return "Hadir";
      default:
        return "Tidak Hadir";
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
      >
        {getStatusText(status)}
      </span>
    );
  };
  const columns: Column<Attendance>[] = [
    {
      header: "ID",
      render: (row: Attendance) => row.id,
    },
    {
      header: "Karyawan",
      render: (row: Attendance) => {
        const employees = employee?.find((item) => item.id === row.employee_id);
        return (
          <div className="flex gap-4">
            {employees?.photo ? (
              <img
                src={`${baseUrl}/storage/employee/${employees?.photo}`}
                className="w-10 h-10 object-cover object-center rounded-full"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employees?.full_name || "User")}&background=cce3de&color=03045e`}
                className="w-10 h-10 object-cover object-center rounded-full"
              />
            )}
            <div>
              <h1 className="font-semibold text-sm">{employees?.full_name}</h1>
              <p className="text-sm">{employees?.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Department",
      render: (row: Attendance) => {
        const departments = department?.find(
          (item) => item.id === row.employee?.department_id,
        );
        return departments?.department_name;
      },
    },

    {
      header: "Check In",
      render: (row: Attendance) => (
        <div className="flex gap-2">
          <p>{formatTime(row.check_in_time)}</p>
          <p className="text-sm text-muted-foreground">
            {getStatusBadge(row.status)}
          </p>
        </div>
      ),
    },
    {
      header: "Check Out",
      render: (row: Attendance) =>
        row.check_out_time ? formatTime(row.check_out_time) : "-",
    },
    {
      header: "Profile",
      render: (row: Attendance) => (
        <div className="flex gap-2">
          <Link
            to={`/admin/karyawan/${row.employee_id}`}
            className="auth-gradient text-white w-30 px-4 py-2 rounded-md text-sm hover:-translate-y-1 hover:cursor-pointer transition"
          >
            Lihat Detail
          </Link>
        </div>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}


export function AttendanceTableUser({ data }: { data: Attendance[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "late":
        return "bg-red-50 text-red-600 border-red-200";
      case "present":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "late":
        return "Terlambat";
      case "present":
        return "Hadir";
      default:
        return "Tidak Hadir";
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
      >
        {getStatusText(status)}
      </span>
    );
  };
  const columns: Column<Attendance>[] = [
    {
      header: "No",
      accessor: "id",
    },
    {
      header: "Hari",
      render: (row: Attendance) => {
        const day = new Date(row.attendance_date).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
       return (
          <div className="flex gap-4">
           <p>{day}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      render: (row: Attendance) => {
        return (<div className="flex items-center gap-2">
          {getStatusBadge(row.status)}
          <p className="text-xs">{row.late_minutes} Menit</p>
        </div>);
      },
    },

    {
      header: "Check In",
      render: (row: Attendance) => (
          <p>{formatTime(row.check_in_time)}</p>
      ),
    },
    {
      header: "Check Out",
      render: (row: Attendance) =>
        row.check_out_time ? formatTime(row.check_out_time) : "-",
    },
  ];
  return <DataTable columns={columns} data={data} />;
}