import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, getAllTasks, updateTask } from "../slices/TaskSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import { toast } from "react-toastify";
import type { ExtendedTaskModalProps } from "../types/Task.interface";
// import { format } from "date-fns";
import { X, Calendar, Flag, Tag, Trash2, Edit3, Save, Info } from "lucide-react";
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
  const { loading } = useSelector((state: RootState) => state.task);
  const modalRef = useRef<HTMLDivElement>(null);

  // --- Logic remains untouched ---
  useEffect(() => {
    if (task && (mode === "edit" || mode === "view")) {
      setFormData({
        name: task.task_name || "",
        description: task.task_description || "",
        status: typeof task?.status === 'string' ? task.status : (task?.status?.name || ""),
        priority: task.priority || "",
        start_date: task.start_date ? task.start_date.split("T")[0] : "",
        end_date: task.end_date ? task.end_date.split("T")[0] : "",
      });
    } else {
      setFormData({ name: "", description: "", status: "", priority: "", start_date: "", end_date: "" });
    }
  }, [task, mode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleOnClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnClose = () => {
    onClose();
    setFormData({ name: "", description: "", status: "", priority: "", start_date: "", end_date: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.status) {
      toast.error("Task name and status are required.");
      return;
    }
    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      status: formData.status,
      priority: (formData.priority as any) || undefined,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    };

    if (mode === "add") {
      const result = await dispatch(createTask(payload));
      if (createTask.fulfilled.match(result)) {
        toast.success("Task created!");
        onClose();
        dispatch(getAllTasks({ viewType: activeView === 'collapsed' ? 'compact' : activeView }));
      }
    } else if (mode === "edit" && task?.id) {
      const result = await dispatch(updateTask({ id: task.id, payload }));
      if (updateTask.fulfilled.match(result)) {
        toast.success("Task updated!");
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  
  // UI Utility Classes
  const labelClass = "text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1.5 flex items-center gap-1.5";
  const inputClass = "w-full p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-75 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
      {/* Background with modern Glassmorphism */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[6px] transition-opacity animate-in fade-in duration-300"></div>
      
      <div
        ref={modalRef}
        className="relative bg-white rounded-[28px] w-full max-w-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
              <Edit3 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {mode === "add" ? "Create New Task" : mode === "edit" ? "Edit Task" : "Task Details"}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  {mode === "add" ? "New" : "Task Board"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleOnClose}
            className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer border border-transparent hover:border-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-10 py-8 overflow-y-auto thin-scrollbar space-y-8 bg-white">
          {/* Main Title Input */}
          <div className="group">
            <label htmlFor="name" className={labelClass}>Task Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="What needs to be done?"
              className={`${inputClass} text-base font-semibold group-hover:border-slate-300`}
            />
          </div>

          {/* Quick Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className={labelClass}><Tag size={12} className="text-indigo-400"/> Current Status</label>
              <select name="status" value={formData.status} onChange={handleChange} disabled={isViewMode} className={inputClass}>
                <option value="">Choose status...</option>
                {statuses.map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}><Flag size={12} className="text-rose-400"/> Priority Level</label>
              <select name="priority" value={formData.priority} onChange={handleChange} disabled={isViewMode} className={inputClass}>
                <option value="">Set Priority...</option>
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
            </div>

            <div>
              <label className={labelClass}><Calendar size={12} className="text-slate-400"/> Starting On</label>
              <input name="start_date" type="date" value={formData.start_date} onChange={handleChange} disabled={isViewMode} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}><Calendar size={12} className="text-slate-400"/> Deadline</label>
              <input name="end_date" type="date" value={formData.end_date} onChange={handleChange} disabled={isViewMode} className={inputClass} />
            </div>
          </div>

          {/* Description Editor */}
          <div className="space-y-2">
            <label className={labelClass}><Info size={12} className="text-slate-400"/> Detailed Description</label>
            <div className={`rounded-2xl border ${isViewMode ? 'bg-slate-50/50 border-slate-200' : 'bg-white border-slate-200 focus-within:border-indigo-500 shadow-sm transition-all overflow-hidden'}`}>
              {isViewMode ? (
                <div className="p-5 prose prose-sm max-w-none text-slate-600 min-h-[160px] leading-relaxed" dangerouslySetInnerHTML={{ __html: formData.description }} />
              ) : (
                <div className="custom-saas-editor">
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.description}
                    onChange={(_, editor) => setFormData(p => ({ ...p, description: editor.getData() }))}
                    config={{
                      licenseKey: "GPL",
                      toolbar: ["undo", "redo", "|", "heading", "|", "bold", "italic", "|", "link", "bulletedList", "numberedList"],
                      plugins: [Bold, Essentials, Heading, Indent, IndentBlock, Italic, Link, List, MediaEmbed, Paragraph, Table, Undo],
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer (Sticky) */}
        <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between mt-auto">
          <div>
            {(mode === "view" || mode === "edit") && task?.id && (
              <button
                onClick={() => { handleDeleteTask(task.id); onClose(); }}
                className="flex items-center gap-2 text-rose-500 hover:bg-rose-100/50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 size={16} /> Delete Task
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleOnClose} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors cursor-pointer">
              Discard
            </button>
            
            {mode === "view" ? (
              <button
                onClick={() => task && handleEditTask(task)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_8px_20px_-4px_rgba(79,70,229,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Edit3 size={18} /> Modify
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_8px_20px_-4px_rgba(79,70,229,0.4)] flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</span>
                ) : (
                  <><Save size={18} /> {mode === "add" ? "Create Task" : "Save Changes"}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;