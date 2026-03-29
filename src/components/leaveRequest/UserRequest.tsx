import {
  Circle,
  CircleCheck,
  CircleX,
  Loader,
  Pencil,
  Trash,
} from "lucide-react";
import type { Employee, LeaveRequest } from "../../types/userType";
import DataTable from "../ui/dataTable";
import { useEffect, useState } from "react";
import api from "../../services/api";

type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  onEdit?: (row: T) => void;
  onActivate?: (row: T) => void;
};

export function LeaveRequestTable({
  data,
  onEdit,
  onDelete,
}: {
  data: LeaveRequest[];
  onEdit: (row: LeaveRequest) => void;
  onDelete: (row: LeaveRequest) => void;
}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [employee, setEmployee] = useState<Employee[]>([]);

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`${baseUrl}/api/employees`);
      const data = response?.data.data.datas.data;
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);
  const columns: Column<LeaveRequest>[] = [
    {
      header: "ID",
      render: (row: LeaveRequest) => row.id,
    },
    {
      header: "Jenis Cuti",
      render: (row: LeaveRequest) => row.leave_type.leave_type_name,
    },
    {
      header: "Tanggal Mulai",
      render: (row: LeaveRequest) => row.start_date,
    },
    {
      header: "Tanggal Selesai",
      render: (row: LeaveRequest) => row.end_date,
    },
    {
      header: "Alasan",
      render: (row: LeaveRequest) => row.reason,
    },
    {
      header: "Status",
      render: (row: LeaveRequest) => (
        <span
          className={`flex gap-2 items-center p-1 justify-center rounded-lg text-xs font-semibold ${
            row.status === "approved"
              ? "bg-success/10 text-success border border-success/20"
              : row.status === "rejected"
                ? "bg-destructive/10 text-destructive border border-destructive /20"
                : "bg-warning/10 text-warning border border-warning/20"
          }`}
        >
          {row.status === "approved" ? (
            <CircleCheck size={16} />
          ) : row.status === "rejected" ? (
            <CircleX size={16} />
          ) : (
            <Loader size={16} className="animate-spin" />
          )}
          {row.status}
        </span>
      ),
    },
    {
      header: "Disetujui Oleh",
      render: (row: LeaveRequest) => {
        const approvedEmployee = employee?.find(
          (item) => item.id === Number(row.approved_by),
        );
        return (
          <div>
            {approvedEmployee ? (
              <div className="flex flex-col">
                <p>{approvedEmployee.full_name}</p>
                <p className="text-xs text-blue-dark/60">{row.approved_at}</p>
              </div>
            ) : (
              "-"
            )}
          </div>
        );
      },
    },
    {
      header: "Aksi",
      render: (row: LeaveRequest) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(row)}
            className="text-sm text-blue-dark px-2 py-2 cursor-pointer hover:bg-success/10 rounded transition"
          >
            <Pencil size={16} className="text-[#2f524a]" />
          </button>
          <button
            onClick={() => onDelete?.(row)}
            className="text-sm text-blue-dark px-2 py-2 cursor-pointer hover:bg-success/10 rounded transition"
          >
            <Trash size={16} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}

export function LeaveAgreementTable({
  data,
  onOpen,
}: {
  data: LeaveRequest[];
  onOpen: (row: LeaveRequest) => void;
}) {
  const columns: Column<LeaveRequest>[] = [
    {
      header: "ID",
      render: (row: LeaveRequest) => row.id,
    },
    {
      header: "Jenis Cuti",
      render: (row: LeaveRequest) => (
        <div className="flex gap-4">
          <img
            src={`http://127.0.0.1:8000/storage/employee/1774284184.fasterino-rafael.jpg`}
            className="w-10 h-10 object-cover object-center rounded-full"
          />
          <div>
            <h1 className="font-semibold text-sm">{row.employee?.full_name}</h1>
            <p className="text-sm">{row.employee?.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Alasan",
      render: (row: LeaveRequest) => row.reason,
    },

    {
      header: "Tanggal Mulai",
      render: (row: LeaveRequest) => row.start_date,
    },
    {
      header: "Tanggal Selesai",
      render: (row: LeaveRequest) => row.end_date,
    },
    {
      header: "Detail",
      render: (row: LeaveRequest) => (
        <div className="flex gap-2">
          <button
            onClick={() => onOpen?.(row)}
            className="auth-gradient text-white w-30 px-4 py-2 rounded-md text-sm hover:-translate-y-1 hover:cursor-pointer transition"
          >
            Lihat Detail
          </button>
        </div>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}
