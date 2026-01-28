import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, getAllTasks } from "../slices/TaskSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import TaskModal from "../components/TaskModal";
import { getAllStatuses } from "../../status/slices/StatusSlice";
import KanbanView from "../components/KanbanView";
import CollapsedView from "../components/CollapsedView";
import TableView from "../components/TableView";
import { Plus, LayoutGrid, List, Table as TableIcon } from "lucide-react";

const getStatusStyle = (status: string) => {
  const styles: any = {
    "To Do": { color: "#6366f1", symbol: "📋" },
    "In Progress": { color: "#f59e0b", symbol: "⚙️" },
    "Done": { color: "#10b981", symbol: "✅" },
    "Complete": { color: "#10b981", symbol: "✅" },
    "Blocked": { color: "#ef4444", symbol: "🚫" },
  };
  return styles[status] || { color: "#94a3b8", symbol: "📌" };
};

const TaskPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.task);
  const { statuses } = useSelector((state: RootState) => state.status);

  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: "add" | "view" | "edit" | "view-day"; task: any | null }>({
    isOpen: false, mode: "add", task: null,
  });

  const [activeView, setActiveView] = useState<"kanban" | "collapsed" | "table">("kanban");
  const [expandedStatuses, setExpandedStatuses] = useState<{ [key: string]: boolean }>({});
  const [expandedTasks, setExpandedTasks] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const viewMap: any = { kanban: "kanban", collapsed: "compact", table: "table" };
    dispatch(getAllTasks({ viewType: viewMap[activeView] }));
  }, [activeView, dispatch]);

  useEffect(() => { dispatch(getAllStatuses()); }, [dispatch]);

  const viewBtnClass = (id: string) => `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
    activeView === id ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
  }`;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Board</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage and track your team's progress in real-time.</p>
        </div>
        <button
          onClick={() => setModalState({ isOpen: true, mode: "add", task: null })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Modern Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex bg-slate-100/80 p-1 rounded-xl">
          <button onClick={() => setActiveView("kanban")} className={viewBtnClass("kanban")}><LayoutGrid size={16}/> Kanban</button>
          <button onClick={() => setActiveView("collapsed")} className={viewBtnClass("collapsed")}><List size={16}/> List</button>
          <button onClick={() => setActiveView("table")} className={viewBtnClass("table")}><TableIcon size={16}/> Table</button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-hidden">
          {activeView === "kanban" && (
            <KanbanView 
              tasks={tasks} loading={loading} error={error} statuses={statuses.map((s: any) => s.name)} 
              getStatusStyle={getStatusStyle} handleOpenModal={(m, t) => setModalState({ isOpen: true, mode: m, task: t })}
              handleEditTask={(t) => setModalState({ isOpen: true, mode: "edit", task: t })}
              handleDeleteTask={(id) => dispatch(deleteTask(id))} dispatch={dispatch} 
            />
          )}
          {activeView === "collapsed" && (
            <CollapsedView tasks={tasks} loading={loading} error={error} getStatusStyle={getStatusStyle}
              handleOpenModal={(m, t) => setModalState({ isOpen: true, mode: m, task: t })}
              handleEditTask={(t) => setModalState({ isOpen: true, mode: "edit", task: t })}
              handleDeleteTask={(id) => dispatch(deleteTask(id))}
              expandedStatuses={expandedStatuses} expandedTasks={expandedTasks}
              toggleStatus={(s) => setExpandedStatuses(p => ({ ...p, [s]: !p[s] }))}
              toggleTask={(id) => setExpandedTasks(p => ({ ...p, [id]: !p[id] }))} dispatch={dispatch} />
          )}
          {activeView === "table" && (
            <TableView tasks={Array.isArray(tasks) ? tasks : []} loading={loading} error={error} getStatusStyle={getStatusStyle}
              handleOpenModal={(m, t) => setModalState({ isOpen: true, mode: m, task: t })}
              handleEditTask={(t) => setModalState({ isOpen: true, mode: "edit", task: t })}
              handleDeleteTask={(id) => dispatch(deleteTask(id))} />
          )}
        </div>
      </div>

      <TaskModal 
        isOpen={modalState.isOpen} onClose={() => setModalState(p => ({ ...p, isOpen: false }))} 
        mode={modalState.mode} task={modalState.task} statuses={statuses.map((s: any) => s.name)} activeView={activeView}
        handleEditTask={(t) => setModalState({ isOpen: true, mode: "edit", task: t })}
        handleDeleteTask={(id) => dispatch(deleteTask(id))} dispatch={dispatch} 
      />
    </div>
  );
};

export default TaskPage;