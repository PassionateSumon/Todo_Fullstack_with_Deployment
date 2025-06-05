// import { useState } from "react";
// import { updateTask, deleteTask, getAllTasks } from "../slices/TaskSlice";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   type DropResult,
// } from "@hello-pangea/dnd";
// import type { KanbanViewProps } from "../types/Task.interface";

// const KanbanView = ({
//   tasks,
//   loading,
//   error,
//   getStatusStyle,
//   handleOpenModal,
//   handleEditTask,
//   handleDeleteTask,
//   dispatch,
// }: KanbanViewProps) => {
//   const [hoveredTask, setHoveredTask] = useState<string | null>(null);

//   const onDragEnd = (result: DropResult) => {
//     const { source, destination, draggableId } = result;

//     if (!destination) return;

//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     const sourceStatus = source.droppableId;
//     const destStatus = destination.droppableId;

//     if (sourceStatus !== destStatus) {
//       const taskId = parseInt(draggableId);
//       const task = Object.values(tasks)
//         .flat()
//         .find((t: any) => t.id === taskId);

//       if (task) {
//         dispatch(
//           updateTask({
//             id: taskId,
//             payload: { status: destStatus },
//           })
//         ).then(() => {
//           dispatch(getAllTasks({ viewType: "kanban", id: null }));
//         });
//       }
//     }
//   };

//   const kanbanColumns = !Array.isArray(tasks) ? tasks : {};

//   return (
//     <>
//       {loading && (
//         <p className="text-[#2D3748] text-center text-sm">Loading tasks...</p>
//       )}
//       {error && <p className="text-[#E53E3E] text-center text-sm">{error}</p>}
//       {!loading && !error && (
//         <DragDropContext onDragEnd={onDragEnd}>
//           <div
//             className="w-full overflow-x-auto overflow-y-hidden"
//             style={{
//               scrollbarWidth: "thin",
//               scrollbarColor: "#CBD5E0 #F3F4FE",
//             }}
//           >
//             <div className="flex flex-row gap-4 pb-4 min-w-fit">
//               {Object.keys(kanbanColumns)?.length === 0 ? (
//                 <p className="text-[#2D3748] text-center text-sm opacity-70">
//                   No statuses available. Add a task to get started.
//                 </p>
//               ) : (
//                 (Object.entries(kanbanColumns) as [string, any[]][]).map(
//                   ([status, tasks]) => {
//                     const { color, symbol } = getStatusStyle(status);
//                     // console.log(tasks[0].id.toString())
//                     return (
//                       <Droppable droppableId={status} key={status}>
//                         {(provided) => (
//                           <div
//                             className="flex-1 min-w-[250px] max-w-[300px]"
//                             {...provided.droppableProps}
//                             ref={provided.innerRef}
//                           >
//                             <div
//                               className="text-[#2D3748] text-lg font-semibold mb-3 px-2 py-1 rounded-t-md flex items-center gap-2 cursor-pointer "
//                               style={{ backgroundColor: `${color}20` }}
//                             >
//                               <span>{symbol}</span>
//                               <span>{status}</span>
//                             </div>
//                             <div
//                               className="h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden bg-transparent space-y-3 px-2"
//                               style={{
//                                 scrollbarWidth: "thin",
//                                 scrollbarColor: "#CBD5E0 #F3F4FE",
//                               }}
//                             >
//                               {tasks.length === 0 ? (
//                                 <p className="text-[#2D3748] text-sm opacity-70">
//                                   No tasks in this status.
//                                 </p>
//                               ) : (
//                                 tasks.map((task: any, index: number) => (
//                                   <Draggable
//                                     key={task.id}
//                                     draggableId={task.id.toString()}
//                                     index={index}
//                                   >
//                                     {(provided, snapshot) => (
//                                       <div
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                         className="relative bg-[#FFFFFF] rounded-md p-3 border border-[#CBD5E0] shadow-sm hover:shadow-md transition-all"
//                                         style={{
//                                           cursor: snapshot.isDragging
//                                             ? "grabbing !important"
//                                             : "grab !important",
//                                           ...provided.draggableProps.style,
//                                         }}
//                                         onMouseEnter={() =>
//                                           setHoveredTask(task.id?.toString())
//                                         }
//                                         onMouseLeave={() =>
//                                           setHoveredTask(null)
//                                         }
//                                         onClick={() =>
//                                           handleOpenModal("view", task)
//                                         }
//                                       >
//                                         <h3 className="text-[#2D3748] text-sm font-medium mb-1">
//                                           {task.task_name || "Unnamed Task"}
//                                         </h3>
//                                         <div className="flex justify-between items-center">
//                                           <span
//                                             className={`text-xs px-2 py-1 rounded-full ${
//                                               task.priority === "high"
//                                                 ? "bg-[#E53E3E] text-white"
//                                                 : task.priority === "medium"
//                                                 ? "bg-[#F6E05E] text-[#2D3748]"
//                                                 : task.priority === "low"
//                                                 ? "bg-[#68D391] text-white"
//                                                 : "bg-[#CBD5E0] text-[#2D3748]"
//                                             }`}
//                                           >
//                                             {task.priority
//                                               ? task.priority
//                                                   .charAt(0)
//                                                   .toUpperCase() +
//                                                 task.priority.slice(1)
//                                               : "No Priority"}
//                                           </span>
//                                           <span className="text-[#2D3748] text-xs opacity-70">
//                                             {task.start_date?.split("T")[0] ||
//                                               "No Date"}
//                                           </span>
//                                         </div>
//                                         {hoveredTask ===
//                                           (task.id as any)?.toString() && (
//                                           <div className="absolute top-2 right-2 flex gap-2">
//                                             <button
//                                               onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleEditTask(task);
//                                               }}
//                                               className="text-[#5A67D8] hover:text-[#434190] transition-colors cursor-pointer"
//                                               title="Edit"
//                                             >
//                                               ✏️
//                                             </button>
//                                             <button
//                                               onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleDeleteTask(task.id);
//                                               }}
//                                               className="text-[#E53E3E] hover:text-[#C53030] transition-colors cursor-pointer"
//                                               title="Delete"
//                                             >
//                                               🗑️
//                                             </button>
//                                           </div>
//                                         )}
//                                       </div>
//                                     )}
//                                   </Draggable>
//                                 ))
//                               )}
//                               {provided.placeholder}
//                             </div>
//                           </div>
//                         )}
//                       </Droppable>
//                     );
//                   }
//                 )
//               )}
//             </div>
//           </div>
//         </DragDropContext>
//       )}
//     </>
//   );
// };

// export default KanbanView;

//-----------------------------------------------------

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   type DropResult,
// } from "@hello-pangea/dnd";
// import type { KanbanViewProps } from "../types/Task.interface";
// import { updateTask, getAllTasks } from "../slices/TaskSlice";
// import { toast } from "react-toastify";

// const KanbanView = ({
//   tasks,
//   loading,
//   error,
//   getStatusStyle,
//   handleOpenModal,
//   handleEditTask,
//   handleDeleteTask,
//   dispatch,
// }: KanbanViewProps) => {
//   const [hoveredTask, setHoveredTask] = useState<string | null>(null);

//   const onDragEnd = (result: DropResult) => {
//     const { source, destination, draggableId } = result;

//     if (!destination) return;

//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     const sourceStatus = source.droppableId;
//     const destStatus = destination.droppableId;

//     if (sourceStatus !== destStatus) {
//       const taskId = parseInt(draggableId);
//       const task = Object.values(tasks)
//         .flat()
//         .find((t: any) => t.id === taskId);

//       if (task) {
//         dispatch(
//           updateTask({
//             id: taskId,
//             payload: { status: destStatus },
//           })
//         ).unwrap().catch((error: any) => {
//           toast.error(error.message || "Failed to update task status");
//           dispatch(getAllTasks({ viewType: "kanban", id: null })); // Refresh tasks on error
//         });
//       }
//     }
//   };

//   const kanbanColumns = !Array.isArray(tasks) ? tasks : {};

//   return (
//     <>
//       {loading && (
//         <p className="text-[#2D3748] text-center text-sm">Loading tasks...</p>
//       )}
//       {error && <p className="text-[#E53E3E] text-center text-sm">{error}</p>}
//       {!loading && !error && (
//         <DragDropContext onDragEnd={onDragEnd}>
//           <div
//             className="w-full overflow-x-auto overflow-y-hidden"
//             style={{
//               scrollbarWidth: "thin",
//               scrollbarColor: "#CBD5E0 #F3F4FE",
//             }}
//           >
//             <div className="flex flex-row gap-4 pb-4 min-w-fit">
//               {Object.keys(kanbanColumns)?.length === 0 ? (
//                 <p className="text-[#2D3748] text-center text-sm opacity-70">
//                   No statuses available. Add a task to get started.
//                 </p>
//               ) : (
//                 (Object.entries(kanbanColumns) as [string, any[]][]).map(
//                   ([status, tasks]) => {
//                     const { color, symbol } = getStatusStyle(status);
//                     const validTasks = tasks.filter((task: any) => task && task.id !== undefined && task.id !== null);
//                     if (tasks.length !== validTasks.length) {
//                       console.warn(`Skipping tasks with missing or invalid IDs in status: ${status}`);
//                     }

//                     return (
//                       <Droppable droppableId={status} key={status}>
//                         {(provided) => (
//                           <div
//                             className="flex-1 min-w-[250px] max-w-[300px]"
//                             {...provided.droppableProps}
//                             ref={provided.innerRef}
//                           >
//                             <div
//                               className="text-[#2D3748] text-lg font-semibold mb-3 px-2 py-1 rounded-t-md flex items-center gap-2 cursor-pointer"
//                               style={{ backgroundColor: `${color}20` }}
//                             >
//                               <span>{symbol}</span>
//                               <span>{status}</span>
//                             </div>
//                             <div
//                               className="h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden bg-transparent space-y-3 px-2"
//                               style={{
//                                 scrollbarWidth: "thin",
//                                 scrollbarColor: "#CBD5E0 #F3F4FE",
//                               }}
//                             >
//                               {validTasks.length === 0 ? (
//                                 <p className="text-[#2D3748] text-sm opacity-70">
//                                   No tasks in this status.
//                                 </p>
//                               ) : (
//                                 validTasks.map((task: any, index: number) => {
//                                   // console.log(task)
//                                   if (!task?.id) {
//                                     console.warn(
//                                       "Skipping task with missing id:",
//                                       task
//                                     );
//                                     return null;
//                                   }

//                                   const draggableId = task.id.toString();
//                                   const isHovered = hoveredTask === draggableId;

//                                   // console.log("Rendering task:", task);

//                                   return (
//                                     <Draggable
//                                       key={draggableId}
//                                       draggableId={draggableId}
//                                       index={index}
//                                     >
//                                       {(provided, snapshot) => (
//                                         <div
//                                           ref={provided.innerRef}
//                                           {...provided.draggableProps}
//                                           {...provided.dragHandleProps}
//                                           className="relative bg-[#FFFFFF] rounded-md p-3 border border-[#CBD5E0] shadowNCs-sm hover:shadow-md transition-all"
//                                           style={{
//                                             cursor: snapshot.isDragging
//                                               ? "grabbing"
//                                               : "grab",
//                                             ...provided.draggableProps.style,
//                                           }}
//                                           onMouseEnter={() =>
//                                             setHoveredTask(draggableId)
//                                           }
//                                           onMouseLeave={() =>
//                                             setHoveredTask(null)
//                                           }
//                                           onClick={() =>
//                                             handleOpenModal("view", task)
//                                           }
//                                         >
//                                           <h3 className="text-[#2D3748] text-sm font-medium mb-1">
//                                             {/* {console.log("Task Name:", task.task_name)} */}
//                                             {task.task_name || "Unnamed Task"}
//                                           </h3>

//                                           <div className="flex justify-between items-center">
//                                             <span
//                                               className={`text-xs px-2 py-1 rounded-full ${task.priority === "high"
//                                                 ? "bg-[#E53E3E] text-white"
//                                                 : task.priority === "medium"
//                                                   ? "bg-[#F6E05E] text-[#2D3748]"
//                                                   : task.priority === "low"
//                                                     ? "bg-[#68D391] text-white"
//                                                     : "bg-[#CBD5E0] text-[#2D3748]"
//                                                 }`}
//                                             >
//                                               {task.priority
//                                                 ? task.priority
//                                                   .charAt(0)
//                                                   .toUpperCase() +
//                                                 task.priority.slice(1)
//                                                 : "No Priority"}
//                                             </span>

//                                             <span className="text-[#2D3748] text-xs opacity-70">
//                                               {task.start_date?.split("T")[0] ||
//                                                 "No Date"}
//                                             </span>
//                                           </div>

//                                           {isHovered && (
//                                             <div className="absolute top-2 right-2 flex gap-2">
//                                               <button
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   handleEditTask(task);
//                                                 }}
//                                                 className="text-[#5A67D8] hover:text-[#434190] transition-colors cursor-pointer"
//                                                 title="Edit"
//                                               >
//                                                 ✏️
//                                               </button>
//                                               <button
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   handleDeleteTask(task.id);
//                                                 }}
//                                                 className="text-[#E53E3E] hover:text-[#C53030] transition-colors cursor-pointer"
//                                                 title="Delete"
//                                               >
//                                                 🗑️
//                                               </button>
//                                             </div>
//                                           )}
//                                         </div>
//                                       )}
//                                     </Draggable>
//                                   );
//                                 })
//                               )}
//                               {provided.placeholder}
//                             </div>
//                           </div>
//                         )}
//                       </Droppable>
//                     );
//                   }
//                 )
//               )}
//             </div>
//           </div>
//         </DragDropContext>
//       )}
//     </>
//   );
// };

// export default KanbanView;

// --------------------------------]

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { KanbanViewProps } from "../types/Task.interface";
import { updateTask } from "../slices/TaskSlice";
import { toast } from "react-toastify";

interface ExtendedKanbanViewProps extends KanbanViewProps {
  statuses: string[]; // Add statuses prop to ensure all statuses are rendered
}

const KanbanView = ({
  tasks,
  loading,
  error,
  getStatusStyle,
  handleOpenModal,
  handleEditTask,
  handleDeleteTask,
  dispatch,
  statuses,
}: ExtendedKanbanViewProps) => {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    if (sourceStatus !== destStatus) {
      const taskId = parseInt(draggableId);
      const task = Object.values(tasks)
        .flat()
        .find((t: any) => t.id === taskId);

      if (task) {
        dispatch(
          updateTask({
            id: taskId,
            payload: { status: destStatus },
          })
        )
          .unwrap()
          .catch((error: any) => {
            toast.error(error.message || "Failed to update task status");
          });
      }
    }
  };

  return (
    <>
      {loading && !statuses.length && (
        <p className="text-[#2D3748] text-center text-sm">Loading tasks...</p>
      )}
      {error && <p className="text-[#E53E3E] text-center text-sm">{error}</p>}
      {!loading && !error && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            className="w-full overflow-x-auto overflow-y-hidden"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5E0 #F3F4FE",
            }}
          >
            <div className="flex flex-row gap-4 pb-4 min-w-fit">
              {statuses.length === 0 ? (
                <p className="text-[#2D3748] text-center text-sm opacity-70">
                  No statuses available. Add a task to get started.
                </p>
              ) : (
                statuses.map((status) => {
                  const tasksInStatus = tasks[status] || []; // Default to empty array if no tasks
                  const { color, symbol } = getStatusStyle(status);
                  const validTasks = tasksInStatus.filter(
                    (task: any) =>
                      task && task.id !== undefined && task.id !== null
                  );
                  if (tasksInStatus.length !== validTasks.length) {
                    console.warn(
                      `Skipping tasks with missing or invalid IDs in status: ${status}`
                    );
                  }

                  return (
                    <Droppable droppableId={status} key={status}>
                      {(provided) => (
                        <div
                          className="flex-1 min-w-[250px] max-w-[300px]"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <div
                            className="text-[#2D3748] text-lg font-semibold mb-3 px-2 py-1 rounded-t-md flex items-center gap-2 cursor-pointer"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <span>{symbol}</span>
                            <span>{status}</span>
                          </div>
                          <div
                            className="h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden bg-transparent space-y-3 px-2"
                            style={{
                              scrollbarWidth: "thin",
                              scrollbarColor: "#CBD5E0 #F3F4FE",
                            }}
                          >
                            {validTasks.length === 0 ? (
                              <p className="text-[#2D3748] text-sm opacity-70">
                                No tasks in this status.
                              </p>
                            ) : (
                              validTasks.map((task: any, index: number) => {
                                if (!task?.id) {
                                  console.warn(
                                    "Skipping task with missing id:",
                                    task
                                  );
                                  return null;
                                }

                                const draggableId = task.id.toString();
                                const isHovered = hoveredTask === draggableId;

                                return (
                                  <Draggable
                                    key={draggableId}
                                    draggableId={draggableId}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="relative bg-[#FFFFFF] rounded-md p-3 border border-[#CBD5E0] shadowNCs-sm hover:shadow-md transition-all"
                                        style={{
                                          cursor: snapshot.isDragging
                                            ? "grabbing"
                                            : "grab",
                                          ...provided.draggableProps.style,
                                        }}
                                        onMouseEnter={() =>
                                          setHoveredTask(draggableId)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredTask(null)
                                        }
                                        onClick={() =>
                                          handleOpenModal("view", task)
                                        }
                                      >
                                        <h3 className="text-[#2D3748] text-sm font-medium mb-1">
                                          {task.task_name || "Unnamed Task"}
                                        </h3>

                                        <div className="flex justify-between items-center">
                                          <span
                                            className={`text-xs px-2 py-1 rounded-full ${task.priority === "high"
                                                ? "bg-[#E53E3E] text-white"
                                                : task.priority === "medium"
                                                  ? "bg-[#F6E05E] text-[#2D3748]"
                                                  : task.priority === "low"
                                                    ? "bg-[#68D391] text-white"
                                                    : "bg-[#CBD5E0] text-[#2D3748]"
                                              }`}
                                          >
                                            {task.priority
                                              ? task.priority
                                                .charAt(0)
                                                .toUpperCase() +
                                              task.priority.slice(1)
                                              : "No Priority"}
                                          </span>

                                          <span className="text-[#2D3748] text-xs opacity-70">
                                            {task.start_date?.split("T")[0] ||
                                              "No Date"}
                                          </span>
                                        </div>

                                        {isHovered && (
                                          <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditTask(task);
                                              }}
                                              className="text-[#5A67D8] hover:text-[#434190] transition-colors cursor-pointer"
                                              title="Edit"
                                            >
                                              ✏️
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task.id);
                                              }}
                                              className="text-[#E53E3E] hover:text-[#C53030] transition-colors cursor-pointer"
                                              title="Delete"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })
                            )}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })
              )}
            </div>
          </div>
        </DragDropContext>
      )}
    </>
  );
};

export default KanbanView;