import { updateTask } from "../slices/TaskSlice";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { ChevronDown, Calendar, Trash2, Edit3 } from "lucide-react";
import type { CollapsedViewProps } from "../types/Task.interface";

const CollapsedView = ({ tasks, loading, error, getStatusStyle, handleOpenModal, handleEditTask, handleDeleteTask, expandedStatuses, expandedTasks, toggleStatus, toggleTask, dispatch }: CollapsedViewProps) => {
  const flattenedTasks = !Array.isArray(tasks) ? Object.values(tasks).flat() : Array.isArray(tasks) ? tasks : [];

  const collapsedColumns = flattenedTasks.reduce((acc: any, task: any) => {
    const status = task.status?.name || "No Status";
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {});

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const taskId = parseInt(draggableId);
    if (source.droppableId !== destination.droppableId) {
      dispatch(updateTask({ id: taskId, payload: { status: destination.droppableId } }));
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 h-[calc(100vh-280px)] flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <h2 className="text-slate-900 text-lg font-extrabold tracking-tight">Tasks</h2>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          {flattenedTasks.length} {flattenedTasks.length === 1 ? 'Active' : 'Active Tasks'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 thin-scrollbar">
        {error && <p className="text-rose-500 text-center py-4 text-xs font-semibold">{error}</p>}
        {loading && !flattenedTasks.length ? (
           <p className="text-slate-400 text-center py-10 animate-pulse text-sm">Loading...</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.keys(collapsedColumns).length === 0 ? (
              <p className="text-slate-400 text-center py-10 text-sm italic">No tasks available.</p>
            ) : (
              (Object.entries(collapsedColumns) as [string, any[]][]).map(([status, tasks]) => {
                const { symbol } = getStatusStyle(status);
                const isExpanded = expandedStatuses[status];

                return (
                  <Droppable droppableId={status} key={status}>
                    {(provided) => (
                      <div className="mb-2" {...provided.droppableProps} ref={provided.innerRef}>
                        <button
                          onClick={() => toggleStatus(status)}
                          className={`w-full flex justify-between items-center p-4 rounded-xl transition-all border ${isExpanded ? 'border-slate-200 bg-slate-50/50 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{symbol}</span>
                            <h3 className="text-slate-800 text-sm font-bold uppercase tracking-wide">{status}</h3>
                          </div>
                          <ChevronDown size={18} className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-2 ml-4 space-y-2 border-l-2 border-slate-100 pl-4 py-2">
                            {tasks.map((task: any, index: number) => (
                              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-white rounded-xl border p-4 shadow-sm transition-all ${snapshot.isDragging ? "ring-2 ring-indigo-500/10 border-indigo-200" : "border-slate-100 hover:border-slate-200"}`}
                                  >
                                    <div className="flex items-center justify-between" onClick={() => toggleTask(task.id.toString())}>
                                      <div className="flex items-center gap-3">
                                        <h4 className="text-slate-800 font-bold text-sm" onClick={(e) => { e.stopPropagation(); handleOpenModal("view", task); }}>
                                          {task.task_name}
                                        </h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${task.priority === 'high' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                                          {task.priority}
                                        </span>
                                      </div>
                                      <ChevronDown size={14} className={`text-slate-300 transition-transform ${expandedTasks[task.id.toString()] ? "rotate-180" : ""}`} />
                                    </div>

                                    {expandedTasks[task.id.toString()] && (
                                      <div className="mt-4 pt-4 border-t border-slate-50 space-y-4 animate-in fade-in slide-in-from-top-1">
                                        <div className="flex gap-6">
                                          <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Deadline</span>
                                            <span className="text-xs text-slate-600 font-semibold flex items-center gap-1.5"><Calendar size={12}/>{task.end_date?.split("T")[0]}</span>
                                          </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed italic">{task.task_description || "No description provided."}</p>
                                        <div className="flex gap-2 justify-end">
                                           <button onClick={() => handleEditTask(task)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 size={14}/></button>
                                           <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14}/></button>
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
                      </div>
                    )}
                  </Droppable>
                );
              })
            )}
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default CollapsedView;