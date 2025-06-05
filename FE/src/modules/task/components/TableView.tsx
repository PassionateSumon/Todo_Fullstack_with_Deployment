// import { useMemo } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   type ColumnDef,
// } from "@tanstack/react-table";
// import { format } from "date-fns";
// import type { TableViewProps } from "../types/Task.interface";

// const TableView = ({
//   tasks,
//   loading,
//   error,
//   getStatusStyle,
//   handleOpenModal,
//   handleEditTask,
//   handleDeleteTask,
// }: TableViewProps) => {
//   // Define columns for the table
//   const columns = useMemo<ColumnDef<any>[]>(
//     () => [
//       {
//         accessorKey: "task_name",
//         header: "Task Name",
//         cell: ({ row }) => (
//           <span
//             className="text-[#2D3748] font-medium cursor-pointer hover:text-[#5A67D8] transition-colors"
//             onClick={() => handleOpenModal("view", row.original)}
//           >
//             {row.original.task_name || "Unnamed Task"}
//           </span>
//         ),
//       },
//       {
//         accessorKey: "task_description",
//         header: "Description",
//         cell: ({ getValue }) => (
//           <span className="text-[#5F6368] cursor-pointer">
//             {String(getValue() ?? "No description")}
//           </span>
//         ),
//       },
//       {
//         accessorKey: "status.name",
//         header: "Status",
//         cell: ({ getValue }) => {
//           const status = getValue() as string;
//           const { color, symbol } = getStatusStyle(status);
//           return (
//             <div className="flex items-center gap-2 cursor-pointer">
//               <span
//                 className="w-3 h-3 rounded-full"
//                 style={{ backgroundColor: color }}
//               />
//               <span className="text-[#2D3748]">
//                 {symbol} {status}
//               </span>
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "priority",
//         header: "Priority",
//         cell: ({ getValue }) => (
//           <span className="text-[#5F6368] cursor-pointer">
//             {String(getValue()) || "N/A"}
//           </span>
//         ),
//       },
//       {
//         accessorKey: "start_date",
//         header: "Start Date",
//         cell: ({ getValue }) => {
//           const date = getValue();
//           return date ? (
//             <span className="text-[#5F6368] cursor-pointer">
//               {format(
//                 new Date(
//                   typeof date === "string" ||
//                   typeof date === "number" ||
//                   date instanceof Date
//                     ? date
//                     : ""
//                 ),
//                 "MMM d, yyyy"
//               )}
//             </span>
//           ) : (
//             "N/A"
//           );
//         },
//       },
//       {
//         accessorKey: "end_date",
//         header: "End Date",
//         cell: ({ getValue }) => {
//           const date = getValue();
//           return date ? (
//             <span className="text-[#5F6368] cursor-pointer">
//               {format(
//                 new Date(
//                   typeof date === "string" ||
//                   typeof date === "number" ||
//                   date instanceof Date
//                     ? date
//                     : ""
//                 ),
//                 "MMM d, yyyy"
//               )}
//             </span>
//           ) : (
//             "N/A"
//           );
//         },
//       },
//       {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => (
//           <div className="flex gap-2">
//             <button
//               onClick={() => handleEditTask(row.original)}
//               className="text-[#5A67D8] hover:text-[#434190] font-medium transition-colors cursor-pointer"
//             >
//               Edit
//             </button>
//             <button
//               onClick={() => handleDeleteTask(row.original.id)}
//               className="text-[#F56565] hover:text-[#C53030] font-medium transition-colors cursor-pointer"
//             >
//               Delete
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [getStatusStyle, handleOpenModal, handleEditTask, handleDeleteTask]
//   );

//   // Initialize React Table
//   const table = useReactTable({
//     data: tasks || [],
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <>
//       {loading && (
//         <p className="text-[#2D3748] text-center text-sm">Loading tasks...</p>
//       )}
//       {error && <p className="text-[#F56565] text-center text-sm">{error}</p>}
//       {!loading && !error && (
//         <div className="bg-[#FFFFFF] rounded-lg shadow-sm border h-[80vh] border-[#DADCE0] overflow-y-auto thin-scrollbar">
//           <table className="w-full text-left ">
//             <thead>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id} className="border-b border-[#DADCE0]">
//                   {headerGroup.headers.map((header) => (
//                     <th
//                       key={header.id}
//                       className="px-4 py-3 text-[#2D3748] text-sm font-semibold bg-[#F8F9FA]"
//                     >
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody>
//               {table.getRowModel().rows.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={columns.length}
//                     className="text-center py-4 text-[#5F6368]"
//                   >
//                     No tasks found
//                   </td>
//                 </tr>
//               ) : (
//                 table.getRowModel().rows.map((row) => (
//                   <tr
//                     key={row.id}
//                     className="border-b border-[#DADCE0] hover:bg-[#F1F3F4] transition-colors"
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <td key={cell.id} className="px-4 py-3 text-sm">
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </>
//   );
// };

// export default TableView;


import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import type { TableViewProps } from "../types/Task.interface";

const TableView = ({
  tasks,
  loading,
  error,
  getStatusStyle,
  handleOpenModal,
  handleEditTask,
  handleDeleteTask,
}: TableViewProps) => {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "task_name",
        header: "Task Name",
        cell: ({ row }) => (
          <span
            className="text-[#2D3748] font-medium cursor-pointer hover:text-[#5A67D8] transition-colors"
            onClick={() => handleOpenModal("view", row.original)}
          >
            {row.original.task_name || "Unnamed Task"}
          </span>
        ),
      },
      {
        accessorKey: "task_description",
        header: "Description",
        cell: ({ getValue }) => (
          <span className="text-[#5F6368] cursor-pointer">
            {String(getValue() ?? "No description")}
          </span>
        ),
      },
      {
        accessorKey: "status.name",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const { color, symbol } = getStatusStyle(status);
          return (
            <div className="flex items-center gap-2 cursor-pointer">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[#2D3748]">
                {symbol} {status}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ getValue }) => (
          <span className="text-[#5F6368] cursor-pointer">
            {String(getValue()) || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ getValue }) => {
          const date = getValue();
          return date ? (
            <span className="text-[#5F6368] cursor-pointer">
              {format(
                new Date(
                  typeof date === "string" ||
                  typeof date === "number" ||
                  date instanceof Date
                    ? date
                    : ""
                ),
                "MMM d, yyyy"
              )}
            </span>
          ) : (
            "N/A"
          );
        },
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ getValue }) => {
          const date = getValue();
          return date ? (
            <span className="text-[#5F6368] cursor-pointer">
              {format(
                new Date(
                  typeof date === "string" ||
                  typeof date === "number" ||
                  date instanceof Date
                    ? date
                    : ""
                ),
                "MMM d, yyyy"
              )}
            </span>
          ) : (
            "N/A"
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditTask(row.original)}
              className="text-[#5A67D8] hover:text-[#434190] font-medium transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteTask(row.original.id)}
              className="text-[#F56565] hover:text-[#C53030] font-medium transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [getStatusStyle, handleOpenModal, handleEditTask, handleDeleteTask]
  );

  const table = useReactTable({
    data: tasks || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {loading && !tasks.length && (
        <p className="text-[#2D3748] text-center text-sm">Loading tasks...</p>
      )}
      {error && <p className="text-[#F56565] text-center text-sm">{error}</p>}
      {!loading && !error && (
        <div className="bg-[#FFFFFF] rounded-lg shadow-sm border h-[80vh] border-[#DADCE0] overflow-y-auto thin-scrollbar">
          <table className="w-full text-left ">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-[#DADCE0]">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-[#2D3748] text-sm font-semibold bg-[#F8F9FA]"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-[#5F6368]"
                  >
                    No tasks found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#DADCE0] hover:bg-[#F1F3F4] transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default TableView;