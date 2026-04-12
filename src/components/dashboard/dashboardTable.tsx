import DataTable from "../ui/dataTable";
import type { Employee } from "../../types/userType";
import { Link } from "react-router-dom";
type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  onOpen?: (row: T) => void;
};

export function EmployeeTableDashboard({
  data,
  onOpen,
}: {
  data: Employee[];
  onOpen?: (row: Employee) => void;
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
          {row.photo ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/storage/employee/${row.photo}`}
              className="w-10 h-10 object-cover object-center rounded-full"
            />
          ) : (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.full_name || "User")}&background=cce3de&color=03045e`}
              className="w-10 h-10 object-cover object-center rounded-full"
            />
          )}
          <div>
            <h1 className="font-semibold hover:underline hover:text-blue-primary transition-colors cursor-pointer">
              <Link to={`/admin/karyawan/${row.id}`}>{row.full_name}</Link>
            </h1>
            <p className="text-sm">{row.nip}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      render: (row: Employee) => row.department?.department_name,
    },
    {
      header: "Present",
      render: (row: Employee) => (
        <p className="text-center text-green-500">0</p>
      ),
    },
    {
      header: "Late",
      render: (row: Employee) => (
        <p className="text-center text-yellow-500">0</p>
      ),
    },
    {
      header: "Sick/Leave",
      render: (row: Employee) => <p className="text-center text-red-500">0</p>,
    },
    {
      header: "Absent",
      render: (row: Employee) => <p className="text-center text-gray-500">0</p>,
    },
    {
      header: "Aksi",
      render: (row: Employee) => (
        <button className="bg-blue-primary text-white px-2 py-2 rounded-lg hover:bg-blue-primary/80 transition-colors cursor-pointer">
          Lihat Details
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
