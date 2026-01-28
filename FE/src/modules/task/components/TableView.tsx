import { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, FileText, Trash2, Edit2 } from "lucide-react";
import type { TableViewProps } from "../types/Task.interface";

const TableView = ({ tasks, loading, error, getStatusStyle, handleOpenModal, handleEditTask, handleDeleteTask }: TableViewProps) => {
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "task_name",
      header: "Task Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <FileText size={14} />
          </div>
          <span
            className="text-slate-900 font-semibold cursor-pointer hover:text-indigo-600 transition-colors truncate max-w-[200px]"
            onClick={() => handleOpenModal("view", row.original)}
          >
            {row.original.task_name || "Unnamed Task"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status.name",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const { color } = getStatusStyle(status);
        return (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-slate-100 bg-white w-fit shadow-sm">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-600 text-[13px] font-medium whitespace-nowrap">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const priority = String(getValue() || "N/A").toLowerCase();
        const colors: Record<string, string> = {
          high: "bg-rose-50 text-rose-600 border-rose-100",
          medium: "bg-amber-50 text-amber-600 border-amber-100",
          low: "bg-emerald-50 text-emerald-600 border-emerald-100",
        };
        return (
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${colors[priority] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
            {priority}
          </span>
        );
      },
    },
    {
      accessorKey: "end_date",
      header: "Deadline",
      cell: ({ getValue }) => {
        const date = getValue();
        return date ? (
          <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
            <Calendar size={14} className="opacity-70" />
            <span className="text-[13px]">{format(new Date(date as any), "MMM d, yyyy")}</span>
          </div>
        ) : <span className="text-slate-300">--</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleEditTask(row.original)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDeleteTask(row.original.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [getStatusStyle, handleOpenModal, handleEditTask, handleDeleteTask]);

  const table = useReactTable({ data: tasks || [], columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
      <div className="flex-1 overflow-auto thin-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 text-slate-500 text-[11px] font-bold uppercase tracking-[0.1em] border-b border-slate-100">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading && !tasks.length ? (
               <tr><td colSpan={columns.length} className="text-center py-20 text-slate-400 animate-pulse">Loading tasks...</td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-20 text-slate-400 italic">No tasks found</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {error && <div className="p-4 bg-rose-50 text-rose-500 text-xs font-medium border-t border-rose-100">{error}</div>}
    </div>
  );
};

export default TableView;