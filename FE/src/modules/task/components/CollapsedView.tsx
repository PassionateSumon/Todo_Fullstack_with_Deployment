import { updateTask, getAllTasks } from "../slices/TaskSlice";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { CollapsedViewProps } from "../types/Task.interface";

const CollapsedView = ({
  tasks,
  loading,
  error,
  getStatusStyle,
  handleOpenModal,
  handleEditTask,
  handleDeleteTask,
  expandedStatuses,
  expandedTasks,
  toggleStatus,
  toggleTask,
  dispatch,
}: CollapsedViewProps) => {
  const flattenedTasks = !Array.isArray(tasks)
    ? Object.values(tasks).flat()
    : Array.isArray(tasks)
    ? tasks
    : [];

  const collapsedColumns = flattenedTasks.reduce((acc: any, task: any) => {
    const status = task.status?.name || "No Status";
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {});

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
      const task = flattenedTasks.find((t: any) => t.id === taskId);

      if (task) {
        dispatch(
          updateTask({
            id: taskId,
            payload: { status: destStatus },
          })
        ).then(() => {
          dispatch(getAllTasks("compact"));
        });
      }
    }
  };

  return (
    <>
      {loading && (
        <p className="text-[#2D3748] text-center text-sm">Loading tasks...</p>
      )}
      {error && <p className="text-[#E53E3E] text-center text-sm">{error}</p>}
      {!loading && !error && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="bg-[#FFFFFF] rounded-lg p-4 shadow-sm border border-[#CBD5E0]">
            <h2 className="text-[#2D3748] text-lg font-semibold mb-3">Tasks</h2>
            {Object.keys(collapsedColumns).length === 0 ? (
              <p className="text-[#2D3748] text-sm opacity-70">
                No tasks available.
              </p>
            ) : (
              <div className="space-y-2">
                {(Object.entries(collapsedColumns) as [string, any[]][]).map(
                  ([status, tasks]) => {
                    const { color, symbol } = getStatusStyle(status);
                    return (
                      <Droppable droppableId={status} key={status}>
                        {(provided) => (
                          <div
                            className="border-b border-[#CBD5E0] last:border-b-0"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            <button
                              onClick={() => toggleStatus(status)}
                              className="w-full flex justify-between items-center py-3 px-2 text-left focus:outline-none cursor-pointer"
                              style={{ backgroundColor: `${color}20` }}
                            >
                              <div className="flex items-center gap-2">
                                <span>{symbol}</span>
                                <h3 className="text-[#2D3748] text-sm font-medium">
                                  {status}
                                </h3>
                              </div>
                              <span
                                className={`text-[#2D3748] transform transition-transform duration-200 ${
                                  expandedStatuses[status]
                                    ? "rotate-180"
                                    : "rotate-0"
                                }`}
                              >
                                ▼
                              </span>
                            </button>
                            {expandedStatuses[status] && (
                              <div className="space-y-2 pb-3 px-2">
                                {tasks.map((task: any, index: number) => (
                                  <Draggable
                                    key={task.id}
                                    draggableId={task.id.toString()}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`ml-4 bg-[#F9FAFB] rounded-md border-l-4 border-[#38B2AC] shadow-sm transition-all ${
                                          snapshot.isDragging
                                            ? "shadow-lg"
                                            : "hover:bg-[#E2E8F0]"
                                        }`}
                                        style={{
                                          cursor: snapshot.isDragging
                                            ? "grabbing !important"
                                            : "grab !important",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <button
                                          onClick={() =>
                                            toggleTask(task.id.toString())
                                          }
                                          className="w-full flex justify-between items-center py-2 px-2 text-left"
                                        >
                                          <div className="flex-1 flex items-center gap-2">
                                            <h3
                                              className="text-[#2D3748] text-sm font-medium"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal("view", task);
                                              }}
                                            >
                                              {task.task_name || "Unnamed Task"}
                                            </h3>
                                            <span
                                              className={`text-xs px-2 py-1 rounded-full ${
                                                task.priority === "high"
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
                                          </div>
                                          <span
                                            className={`text-[#2D3748] transform transition-transform duration-200 ${
                                              expandedTasks[task.id.toString()]
                                                ? "rotate-180"
                                                : "rotate-0"
                                            } cursor-pointer`}
                                          >
                                            ▼
                                          </span>
                                        </button>
                                        {expandedTasks[task.id.toString()] && (
                                          <div className="ml-6 mt-2 p-2 bg-[#F3F4FE] rounded-md flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                            <div className="flex-1 flex flex-wrap gap-3">
                                              <div>
                                                <span className="text-[#2D3748] text-xs font-medium">
                                                  Start Date:{" "}
                                                </span>
                                                <span className="text-[#2D3748] text-xs opacity-70">
                                                  {task.start_date?.split(
                                                    "T"
                                                  )[0] || "No Date"}
                                                </span>
                                              </div>
                                              <div>
                                                <span className="text-[#2D3748] text-xs font-medium">
                                                  End Date:{" "}
                                                </span>
                                                <span className="text-[#2D3748] text-xs opacity-70">
                                                  {task.end_date?.split(
                                                    "T"
                                                  )[0] || "No End Date"}
                                                </span>
                                              </div>
                                              <div>
                                                <span className="text-[#2D3748] text-xs font-medium">
                                                  Description:{" "}
                                                </span>
                                                <span className="text-[#2D3748] text-xs opacity-70">
                                                  {task.task_description ||
                                                    "No Description"}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
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
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </DragDropContext>
      )}
    </>
  );
};

export default CollapsedView;
