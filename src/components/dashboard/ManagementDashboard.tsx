import { Pencil, Power, Trash } from "lucide-react";
import DataTable from "../ui/dataTable";
import type {
  Department,
  Employee,
  Position,
  Role,
  User,
} from "../../types/userType";
import { Link } from "react-router-dom";
import { toRupiah } from "../../utils/toRupiah";
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

export function PositionTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Position[];
  onEdit?: (row: Position) => void;
  onDelete?: (row: Position) => void;
}) {
  const columns: Column<Position>[] = [
    {
      header: "ID",
      render: (row: Position) => row.id,
    },
    {
      header: "Nama Position",
      render: (row: Position) => row.position_name,
    },
    {
      header: "Deskripsi",
      render: (row: Position) => row.description,
    },
    {
      header: "Base Salary",
      render: (row: Position) => toRupiah(row.base_salary),
    },
    {
      header: "Aksi",
      render: (row: Position) => (
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

export function RoleTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Role[];
  onEdit?: (row: Role) => void;
  onDelete?: (row: Role) => void;
}) {
  const columns: Column<Role>[] = [
    {
      header: "ID",
      render: (row: Role) => row.id,
    },
    {
      header: "Nama Role",
      render: (row: Role) => row.role_name,
    },
    {
      header: "Deskripsi",
      render: (row: Role) => row.description,
    },
    {
      header: "Aksi",
      render: (row: Role) => (
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

export function UserTable({
  data,
  onEdit,
  onDelete,
}: {
  data: User[];
  onEdit?: (row: User) => void;
  onDelete?: (row: User) => void;
}) {
  const lastLoginDate = (data: string) => {
    const splitDate = data.split(" ");
    return splitDate[0];
  };
  const lastLoginTime = (data: string) => {
    const splitDate = data.split(" ");
    return splitDate[1];
  };

  const columns: Column<User>[] = [
    {
      header: "ID",
      render: (row: User) => row.id,
    },
    {
      header: "Nama",
      render: (row: User) => row.name,
    },
    {
      header: "Email",
      render: (row: User) => row.email,
    },
    {
      header: "Role",
      render: (row: User) => row.role?.role_name,
    },
    {
      header: "Last Login",
      render: (row: User) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {lastLoginDate(row?.last_login_at || "-")}
          </span>
          <span className="text-sm">
            {lastLoginTime(row?.last_login_at || "-")}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row: User) => (row.is_active === 1 ? "Aktif" : "Tidak Aktif"),
    },
    {
      header: "Aksi",
      render: (row: User) => (
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
