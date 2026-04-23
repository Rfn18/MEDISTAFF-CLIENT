import React from "react";
import { Loading } from "./load";

type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export default function DataTable<T>({ columns, data }: DataTableProps<T>) {
  return (
    <table className="w-full text-left text-sm text-blue-dark border-collapse min-w-[700px] mt-4">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th
              key={i}
              className="font-semibold uppercase tracking-wider text-[11px] px-6 py-4"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-border">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center p-6">
              <Loading message="Memuat Data..." />
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-blue-50/30 transition-colors group text-blue-dark"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {col.render
                    ? col.render(row, rowIndex)
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
