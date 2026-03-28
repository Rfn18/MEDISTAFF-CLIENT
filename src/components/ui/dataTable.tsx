import React from "react";
import { Loading } from "./load";

type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export default function DataTable<T>({ columns, data }: DataTableProps<T>) {
  return (
    <table className="w-full text-left mt-4">
      <thead>
        <tr className="border-b border-border text-sm text-blue-dark font-semibold">
          {columns.map((col, i) => (
            <th key={i} className="p-4">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="text-sm text-blue-dark">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center p-6">
              <Loading message="Memuat Data..." />
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-[#119184]/20">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-4">
                  {col.render
                    ? col.render(row)
                    : col.accessor
                      ? String((row as any)[col.accessor])
                      : "-"}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
