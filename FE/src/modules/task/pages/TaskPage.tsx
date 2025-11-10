import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, getAllTasks } from "../slices/TaskSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import TaskModal from "../components/TaskModal";
import { getAllStatuses } from "../../status/slices/StatusSlice";
import KanbanView from "../components/KanbanView";
import CollapsedView from "../components/CollapsedView";
import CalendarView from "../components/CalenderView";
import TableView from "../components/TableView";

// Map of status names to colors and symbols
const statusStyles: { [key: string]: { color: string; symbol: string } } = {
  "To Do": { color: "#4FD1C5", symbol: "📋" },
  "In Progress": { color: "#F6AD55", symbol: "⚙️" },
  Done: { color: "#68D391", symbol: "✅" },
  Blocked: { color: "#F56565", symbol: "🚫" },
  Review: { color: "#A78BFA", symbol: "👀" },
};

// Fallback colors for dynamic statuses not in the map
const fallbackColors = ["#60A5FA", "#F472B6", "#FBBF24", "#34D399", "#A3E635"];

const getStatusStyle = (status: string) => {
  if (statusStyles[status]) {
    return statusStyles[status];
  }
  const color =
    fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
  return { color, symbol: "📌" };
};

const TaskPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.task
  );
  const { statuses } = useSelector((state: RootState) => state.status);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "view" | "edit" | "view-day";
    task: any | null;
  }>({
    isOpen: false,
    mode: "add",
    task: null,
  });

  const [activeView, setActiveView] = useState<
    "kanban" | "collapsed" | "calendar" | "table"
  >("kanban");

  const [expandedStatuses, setExpandedStatuses] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedTasks, setExpandedTasks] = useState<{
    [key: string]: boolean;
  }>({});

  const [isDragged, setIsDragged] = useState<boolean>(false);
  console.log(isDragged)

  // Fetch tasks and statuses
  useEffect(() => {
    let viewType: "kanban" | "calendar" | "compact" | "table";
    switch (activeView) {
      case "kanban":
        viewType = "kanban";
        break;
      case "collapsed":
        viewType = "compact";
        break;
      case "calendar":
        viewType = "calendar";
        break;
      case "table":
        viewType = "table";
        break;
      default:
        viewType = "kanban";
    }
    dispatch(getAllTasks({ viewType }));
  }, [activeView, dispatch]);

  useEffect(() => {
    dispatch(getAllStatuses());
  }, [dispatch]);

  const handleOpenModal = (
    mode: "add" | "view" | "edit" | "view-day",
    task: any | null = null
  ) => {
    setModalState({ isOpen: true, mode, task });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: "add", task: null });
  };

  const handleEditTask = (task: any) => {
    handleOpenModal("edit", task);
  };

  const toggleStatus = (status: string) => {
    setExpandedStatuses((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="min-h-screen h-[90vh] w-[80vw] overflow-x-auto bg-[#F3F4FE] p-3 mt-[-10px] ">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-[#2D3748] text-2xl font-semibold"></h1>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-[#5A67D8] hover:bg-[#434190] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>+</span> Add Task
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex gap-4 mb-2.5 border-b border-[#CBD5E0]">
        <button
          onClick={() => setActiveView("kanban")}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeView === "kanban"
              ? "text-[#5A67D8] border-b-2 border-[#5A67D8]"
              : "text-[#2D3748] hover:text-[#5A67D8]"
          } cursor-pointer`}
        >
          Kanban
        </button>
        <button
          onClick={() => setActiveView("collapsed")}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeView === "collapsed"
              ? "text-[#5A67D8] border-b-2 border-[#5A67D8]"
              : "text-[#2D3748] hover:text-[#5A67D8]"
          } cursor-pointer`}
        >
          Collapsed
        </button>
        <button
          onClick={() => setActiveView("calendar")}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeView === "calendar"
              ? "text-[#5A67D8] border-b-2 border-[#5A67D8]"
              : "text-[#2D3748] hover:text-[#5A67D8]"
          } cursor-pointer`}
        >
          Calendar
        </button>
        <button
          onClick={() => setActiveView("table")}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeView === "table"
              ? "text-[#5A67D8] border-b-2 border-[#5A67D8]"
              : "text-[#2D3748] hover:text-[#5A67D8]"
          } cursor-pointer`}
        >
          Table
        </button>
      </div>

      {/* View Rendering */}
      {activeView === "kanban" && (
        <KanbanView
          tasks={tasks}
          loading={loading}
          error={error}
          statuses={statuses.map((status: any) => status.name)}
          getStatusStyle={getStatusStyle}
          handleOpenModal={handleOpenModal}
          handleEditTask={handleEditTask}
          handleDeleteTask={(taskId) => dispatch(deleteTask(taskId))}
          dispatch={dispatch}
        />
      )}

      {activeView === "collapsed" && (
        <CollapsedView
          tasks={tasks}
          loading={loading}
          error={error}
          getStatusStyle={getStatusStyle}
          handleOpenModal={handleOpenModal}
          handleEditTask={handleEditTask}
          handleDeleteTask={(taskId) => dispatch(deleteTask(taskId))}
          expandedStatuses={expandedStatuses}
          expandedTasks={expandedTasks}
          toggleStatus={toggleStatus}
          toggleTask={toggleTask}
          dispatch={dispatch}
        />
      )}

      {activeView === "calendar" && (
        <CalendarView
          tasks={tasks}
          loading={loading}
          error={error}
          handleOpenModal={handleOpenModal}
          handleEditTask={handleEditTask}
          setIsDragged={setIsDragged}
        />
      )}

      {activeView === "table" && (
        <TableView
          tasks={Array.isArray(tasks) ? tasks : []}
          loading={loading}
          error={error}
          getStatusStyle={getStatusStyle}
          handleOpenModal={handleOpenModal}
          handleEditTask={handleEditTask}
          handleDeleteTask={(taskId) => dispatch(deleteTask(taskId))}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        task={modalState.task}
        statuses={statuses.map((status: any) => status.name)}
        activeView={activeView}
        handleEditTask={handleEditTask}
        handleDeleteTask={(taskId) => dispatch(deleteTask(taskId))}
        dispatch={dispatch}
      />
    </div>
  );
};

export default TaskPage;