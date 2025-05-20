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
