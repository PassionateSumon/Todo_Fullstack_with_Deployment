import type { AppDispatch } from "../../../store/store";

export interface Task {
  id: number;
  task_name: string;
  task_description: string | null;
  status_id: number;
  priority: "high" | "medium" | "low" | null;
  start_date: string | null;
  end_date: string | null;
  status: { id: number; name: string };
}

export interface TaskState {
  tasks: Task[] | { [key: string]: Task[] }; // For compact, kanban, or calendar views
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "view" | "edit";
  task?: Task | null;
}

export interface ExtendedTaskModalProps extends TaskModalProps {
  activeView: "kanban" | "collapsed" | "calendar" | "table";
  statuses: string[];
}

export interface KanbanViewProps {
  tasks: any;
  loading: boolean;
  error: string | null;
  getStatusStyle: (status: string) => { color: string; symbol: string };
  handleOpenModal: (mode: "add" | "view" | "edit", task?: any) => void;
  handleEditTask: (task: any) => void;
  handleDeleteTask: (taskId: number) => void;
  dispatch: AppDispatch;
}

export interface CollapsedViewProps {
  tasks: any;
  loading: boolean;
  error: string | null;
  getStatusStyle: (status: string) => { color: string; symbol: string };
  handleOpenModal: (mode: "add" | "view" | "edit", task?: any) => void;
  handleEditTask: (task: any) => void;
  handleDeleteTask: (taskId: number) => void;
  expandedStatuses: { [key: string]: boolean };
  expandedTasks: { [key: string]: boolean };
  toggleStatus: (status: string) => void;
  toggleTask: (taskId: string) => void;
  dispatch: AppDispatch;
}

export interface CalendarViewProps {
  tasks: any;
  loading: boolean;
  error: string | null;
  handleOpenModal: (mode: "add" | "view" | "edit", task?: any) => void;
  handleEditTask: (task: any) => void;
}

export interface CalendarViewProps {
  tasks: any;
  loading: boolean;
  error: string | null;
  handleOpenModal: (mode: "add" | "view" | "edit", task?: any) => void;
  handleEditTask: (task: any) => void;
}

export interface TableViewProps {
  tasks: any[];
  loading: boolean;
  error: string | null;
  getStatusStyle: (status: string) => { color: string; symbol: string };
  handleOpenModal: (mode: "add" | "view" | "edit", task?: any) => void;
  handleEditTask: (task: any) => void;
  handleDeleteTask: (taskId: number) => void;
}
