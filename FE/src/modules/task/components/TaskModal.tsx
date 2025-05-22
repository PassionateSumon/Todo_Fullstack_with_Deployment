import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, getAllTasks, updateTask } from "../slices/TaskSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import { toast } from "react-toastify";
import type { ExtendedTaskModalProps } from "../types/Task.interface";

const TaskModal = ({
  isOpen,
  onClose,
  mode,
  task,
  statuses,
  activeView,
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

  // Ref for the modal to detect outside clicks
  const modalRef = useRef<HTMLDivElement>(null);

  // Populate form data when task changes (for Edit/View modes)
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

  // Handle click outside to close the modal
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

  // Handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Map activeView to viewType
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

  // Handle form submission
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

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      status: formData.status,
      priority: priority,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    };

    if (mode === "add") {
      const result = await dispatch(createTask(payload));
      if (createTask.fulfilled.match(result)) {
        toast.success("Task created successfully!", {
          toastId: "task-create-success",
        });
        onClose();
        dispatch(getAllTasks(getViewType())); // Use dynamic viewType
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
        dispatch(getAllTasks(getViewType())); // Use dynamic viewType
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
  const title =
    mode === "add"
      ? "Add New Task"
      : mode === "edit"
      ? "Edit Task"
      : "View Task";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred Background */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-[#FFFFFF] rounded-xl w-[600px] max-w-[90vw] p-4 z-10 shadow-lg"
      >
        {/* Cross Button (Top-Right) */}
        <button
          onClick={handleOnClose}
          className="absolute top-2 right-2 text-[#2D3748] text-xl font-medium bg-transparent border-none cursor-pointer hover:text-[#5A67D8] transition-colors"
          aria-label="Close Modal"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-[#2D3748] text-xl font-semibold text-center mb-4">
          {title}
        </h2>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Task Name */}
          <div>
            <label htmlFor="name" className="text-[#2D3748] text-sm block mb-1">
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

          {/* Status */}
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

          {/* Priority */}
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

          {/* Start Date */}
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

          {/* End Date */}
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

        {/* Description (Full Width) */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="text-[#2D3748] text-sm block mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isViewMode}
            className="w-full p-2 border border-[#CBD5E0] rounded-md text-[#2D3748] text-sm outline-none focus:border-[#5A67D8] transition-colors resize-none h-[60px] disabled:bg-[#F9FAFB]"
            aria-label="Task Description"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-[#E53E3E] text-center text-xs mb-3">{error}</p>
        )}

        {/* Submit Button (Right-Aligned) */}
        <div className="flex justify-end px-2">
          {mode !== "view" && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-[#5A67D8] text-[#FFFFFF] font-medium text-sm py-1.5 px-5 rounded-md border-none transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#434190]"
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
      </div>
    </div>
  );
};

export default TaskModal;
