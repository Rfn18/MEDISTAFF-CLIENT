import { Pencil, Power, Trash } from "lucide-react";
import DataTable from "../ui/dataTable";
import type { Department, Employee } from "../../types/userType";
type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  onEdit?: (row: T) => void;
  onActivate?: (row: T) => void;
};

export function EmployeeTable({
  data,
  onEdit,
  onActivate,
}: {
  data: Employee[];
  onEdit?: (row: Employee) => void;
  onActivate?: (row: Employee) => void;
}) {
  const columns: Column<Employee>[] = [
    {
      header: "ID",
      render: (row: Employee) => row.id,
    },
    {
      header: "Karyawan",
      render: (row: Employee) => (
        <div className="flex gap-4">
          <img
            src="/img/FasterinoFormal.png"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className="font-semibold">{row.full_name}</h1>
            <p className="text-sm">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Jabatan",
      render: (row: Employee) => row.position?.position_name,
    },
    {
      header: "Department",
      render: (row: Employee) => row.department?.department_name,
    },
    {
      header: "Status",
      accessor: "employee_status",
    },
    {
      header: "Aksi",
      render: (row: Employee) => (
        <>
          <button
            onClick={() => onEdit?.(row)}
            className="text-sm text-blue-dark px-2 py-2 cursor-pointer hover:bg-success/10 rounded transition"
          >
            <Pencil size={16} className="text-[#2f524a]" />
          </button>

          <button
            onClick={() => onActivate?.(row)}
            className="text-sm text-warning px-2 py-2 ml-2 cursor-pointer hover:bg-warning/10 rounded transition"
          >
            <Power size={16} className="text-red-500" />
          </button>
        </>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

export function DepartmentTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Department[];
  onEdit?: (row: Department) => void;
  onDelete?: (row: Department) => void;
}) {
  const columns: Column<Department>[] = [
    {
      header: "ID",
      render: (row: Department) => row.id,
    },
    {
      header: "Nama Department",
      render: (row: Department) => row.department_name,
    },
    {
      header: "Deskripsi",
      render: (row: Department) => row.description,
    },
    {
      header: "Aksi",
      render: (row: Department) => (
        <>
          <button
            onClick={() => onEdit?.(row)}
            className="text-sm text-blue-dark px-2 py-2 cursor-pointer hover:bg-success/10 rounded transition"
          >
            <Pencil size={16} className="text-[#2f524a]" />
          </button>

          <button
            onClick={() => onDelete?.(row)}
            className="text-sm text-warning px-2 py-2 ml-2 cursor-pointer hover:bg-warning/10 rounded transition"
          >
            <Trash size={16} className="text-red-500" />
          </button>
        </>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
