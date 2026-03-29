import DataTable from "../ui/dataTable";
import type { Allowance, Deduction } from "../../types/payrollType";
import { Loader2, Pencil, Power } from "lucide-react";
import { toRupiah } from "../../utils/toRupiah";

type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

export function AllowanceTable({
  data,
  onEdit,
  onDelete,
  loading,
}: {
  data: Allowance[];
  onEdit?: (row: Allowance) => void;
  onDelete?: (row: Allowance) => void;
  loading: boolean;
}) {
  const columns: Column<Allowance>[] = [
    {
      header: "ID",
      render: (row: Allowance) => row.id,
    },
    {
      header: "Nama",
      render: (row: Allowance) => row.allowance_name,
    },
    {
      header: "Deskripsi",
      render: (row: Allowance) => row.description,
    },

    {
      header: "Amount",
      render: (row: Allowance) => toRupiah(row.amount),
    },
    {
      header: "Aksi",
      render: (row: Allowance) => (
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
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Power size={16} className="text-red-500" />
            )}
          </button>
        </>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}

export function DeductionTable({
  data,
  onEdit,
  onDelete,
  loading,
}: {
  data: Deduction[];
  onEdit?: (row: Deduction) => void;
  onDelete?: (row: Deduction) => void;
  loading: boolean;
}) {
  const columns: Column<Deduction>[] = [
    {
      header: "ID",
      render: (row: Deduction) => row.id,
    },
    {
      header: "Nama",
      render: (row: Deduction) => row.deduction_name,
    },
    {
      header: "Deskripsi",
      render: (row: Deduction) => row.description,
    },

    {
      header: "Amount",
      render: (row: Deduction) => toRupiah(row.amount),
    },
    {
      header: "Aksi",
      render: (row: Deduction) => (
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
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Power size={16} className="text-red-500" />
            )}
          </button>
        </>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}
