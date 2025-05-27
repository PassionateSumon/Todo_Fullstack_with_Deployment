import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, getAllTasks, updateTask } from "../slices/TaskSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import { toast } from "react-toastify";
import type { ExtendedTaskModalProps } from "../types/Task.interface";
import { format } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

// Add "view-day" to the mode type
const TaskModal = ({
  isOpen,
  onClose,
  mode,
  task,
  statuses,
  activeView,
  handleEditTask,
  handleDeleteTask,
}: ExtendedTaskModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    priority: "",
    start_date: "",
    end_date: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.task);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task && (mode === "edit" || mode === "view")) {
      setFormData({
        name: task.task_name || "",
        description: task.task_description || "",
        status: task.status?.name || "",
        priority: task.priority || "",
        start_date: task.start_date ? task.start_date.split("T")[0] : "",
        end_date: task.end_date ? task.end_date.split("T")[0] : "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: "",
        priority: "",
        start_date: "",
        end_date: "",
      });
    }
  }, [task, mode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleOnClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getViewType = () => {
    switch (activeView) {
      case "kanban":
        return "kanban";
      case "collapsed":
        return "compact";
      case "calendar":
        return "calendar";
      case "table":
        return "table";
      default:
        return "kanban";
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.status) {
      toast.error("Task name and status are required.", {
        toastId: "task-validation",
      });
      return;
    }
    const allowedPriorities = ["high", "medium", "low"] as const;
    const priority = allowedPriorities.includes(formData.priority as any)
      ? (formData.priority as "high" | "medium" | "low")
      : undefined;

    if (formData.description) {
      const des =
        new DOMParser().parseFromString(formData.description, "text/html").body
          .textContent || "";
      formData.description = des;
    }
    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      status: formData.status,
      priority: priority,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    };

    if (mode === "add") {
      console.log("add task: --> ", payload);
      const result = await dispatch(createTask(payload));
      if (createTask.fulfilled.match(result)) {
        toast.success("Task created successfully!", {
          toastId: "task-create-success",
        });
        onClose();
        dispatch(getAllTasks({ viewType: getViewType() }));
      }
      setFormData({
        name: "",
        description: "",
        status: "",
        priority: "",
        start_date: "",
        end_date: "",
      });
    } else if (mode === "edit" && task?.id) {
      const result = await dispatch(updateTask({ id: task.id, payload }));
      if (updateTask.fulfilled.match(result)) {
        toast.success("Task updated successfully!", {
          toastId: "task-update-success",
        });
        onClose();
        dispatch(getAllTasks({ viewType: getViewType() }));
      }
    }
  };

  const handleOnClose = () => {
    onClose();
    setFormData({
      name: "",
      description: "",
      status: "",
      priority: "",
      start_date: "",
      end_date: "",
    });
  };

  const isViewMode = mode === "view";
  const isViewDayMode = mode === "view-day";
  const title =
    mode === "add"
      ? "Add New Task"
      : mode === "edit"
      ? "Edit Task"
      : mode === "view"
      ? "View Task"
      : `Tasks on ${task?.date ? format(task.date, "MMM d, yyyy") : ""}`;

  if (!isOpen) return null;

  function setModalState(arg: {
    isOpen: boolean;
    mode: string;
    task: any;
  }): void {}

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div
        ref={modalRef}
        className="relative bg-[#FFFFFF] rounded-xl w-[600px] max-w-[90vw] p-4 z-10 shadow-lg"
      >
        <button
          onClick={handleOnClose}
          className="absolute top-2 right-2 text-[#2D3748] text-xl font-medium bg-transparent border-none cursor-pointer hover:text-[#5A67D8] transition-colors"
          aria-label="Close Modal"
        >
          ×
        </button>
        <h2 className="text-[#2D3748] text-xl font-semibold text-center mb-4">
          {title}
        </h2>

        {/* For "view-day" mode, show a list of tasks */}
        {isViewDayMode ? (
          <div className="max-h-[400px] overflow-y-auto">
            {(task?.tasks?.length ?? 0) > 0 ? (
              <ul className="space-y-2">
                {(task?.tasks ?? []).map((t: any) => (
                  <li
                    key={t.id}
                    className="p-2 bg-[#F9FAFB] rounded-md cursor-pointer hover:bg-[#EDF2F7] transition-colors"
                    onClick={() =>
                      setModalState({ isOpen: true, mode: "view", task: t })
                    }
                  >
                    <div className="flex justify-between items-center ">
                      <span className="text-[#2D3748] text-sm">
                        {t.task_name}
                      </span>
                      <span className="text-[#5A67D8] text-xs">
                        {t.status?.name || "No Status"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          className="cursor-pointer"
                          onClick={() => handleEditTask(t)}
                        >
                          ✏️
                        </button>
                        <button
                          className="cursor-pointer"
                          onClick={() => {
                            handleDeleteTask(t.id);
                            onClose();
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#2D3748] text-sm text-center">
                No tasks on this day.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Existing Form Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-[#2D3748] text-sm block mb-1"
                >
                  Task Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full p-2 border border-[#CBD5E0] rounded-md text-[#2D3748] text-sm outline-none focus:border-[#5A67D8] transition-colors disabled:bg-[#F9FAFB]"
                  aria-label="Task Name"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="text-[#2D3748] text-sm block mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full p-2 border border-[#CBD5E0] rounded-md text-[#2D3748] text-sm outline-none focus:border-[#5A67D8] transition-colors bg-[#FFFFFF] disabled:bg-[#F9FAFB]"
                  aria-label="Task Status"
                >
                  <option value="">Select Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="priority"
                  className="text-[#2D3748] text-sm block mb-1"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full p-2 border border-[#CBD5E0] rounded-md text-[#2D3748] text-sm outline-none focus:border-[#5A67D8] transition-colors bg-[#FFFFFF] disabled:bg-[#F9FAFB]"
                  aria-label="Task Priority"
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="start_date"
                  className="text-[#2D3748] text-sm block mb-1"
                >
                  Start Date
                </label>
                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full p-2 border border-[#CBD5E0] rounded-md text-[#2D3748] text-sm outline-none focus:border-[#5A67D8] transition-colors disabled:bg-[#F9FAFB]"
                  aria-label="Start Date"
                />
              </div>
              <div>
                <label
                  htmlFor="end_date"
                  className="text-[#2D3748] text-sm block mb-1"
                >
                  End Date
                </label>
                <input
                  id="end_date"
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full p-2 border border-[#CBD5E0] rounded-md text-[#2D3748] text-sm outline-none focus:border-[#5A67D8] transition-colors disabled:bg-[#F9FAFB]"
                  aria-label="End Date"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="text-[#2D3748] text-sm block mb-1"
              >
                Description
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={(event, editor) => {
                  const data = editor.getData() || "";
                  setFormData((prev) => ({ ...prev, description: data }));
                }}
                disabled={isViewMode}
                config={{
                  licenseKey: "GPL",
                  language: {
                    ui: "en",
                    content: "en",
                  },
                  toolbar: [
                    "undo",
                    "redo",
                    "|",
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "|",
                    "link",
                    "insertTable",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "indent",
                    "outdent",
                  ],
                  plugins: [
                    Bold,
                    Essentials,
                    Heading,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    List,
                    MediaEmbed,
                    Paragraph,
                    Table,
                    Undo,
                  ],
                  initialData: "",
                }}
              />
            </div>

            {error && (
              <p className="text-[#E53E3E] text-center text-xs mb-3">{error}</p>
            )}
            <div className="flex justify-end px-2">
              {mode !== "view" && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`bg-[#5A67D8] text-[#FFFFFF] font-medium text-sm py-1.5 px-5 rounded-md border-none transition-colors cursor-pointer ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#434190]"
                  }`}
                >
                  {loading
                    ? "Submitting..."
                    : mode === "add"
                    ? "Add Task"
                    : "Update Task"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
