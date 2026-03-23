import { Pencil, Trash } from "lucide-react";
import DataTable from "../ui/dataTable";
import type { Employee } from "../../types/employee";
type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
};

export default function EmployeeTable({ data }: { data: Employee[] }) {
  const columns: Column<Employee>[] = [
    {
      header: "ID",
      accessor: "id",
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
      render: () => (
        <>
          <button className="text-sm text-blue-dark px-2 py-2 cursor-pointer hover:bg-success/10 rounded transition">
            <Pencil size={16} className="text-[#2f524a]" />
          </button>

          <button className="text-sm text-warning px-2 py-2 ml-2 cursor-pointer hover:bg-warning/10 rounded transition">
            <Trash size={16} className="text-warning" />
          </button>
        </>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
