import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, getAllTasks, updateTask } from "../slices/TaskSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import { toast } from "react-toastify";
import type { ExtendedTaskModalProps } from "../types/Task.interface";
import { X, Calendar, Flag, Tag, Trash2, Edit3, Save, AlignLeft, Layout, ChevronRight } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor, Bold, Essentials, Heading, Indent, IndentBlock, Italic, Link, List, MediaEmbed, Paragraph, Table, Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const TaskModal = ({
  isOpen, onClose, mode, task, statuses, activeView, handleEditTask, handleDeleteTask,
}: ExtendedTaskModalProps) => {
  const [formData, setFormData] = useState({
    name: "", description: "", status: "", priority: "", start_date: "", end_date: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.task);
  const modalRef = useRef<HTMLDivElement>(null);

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
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) handleOnClose();
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

  // Refined Styles
  // const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2";
  const inputClass = "w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:bg-slate-50 disabled:text-slate-500";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"></div>
      
      <div
        ref={modalRef}
        className="relative bg-white rounded-[32px] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-200/50"
      >
        {/* Header Section */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Layout size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Workspace</span> <ChevronRight size={10} /> <span>Tasks</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {mode === "add" ? "New Task" : mode === "edit" ? "Edit Task" : "Task Overview"}
              </h2>
            </div>
          </div>
          <button onClick={handleOnClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* BODY LAYOUT: Split into Main (Left) and Sidebar (Right) for better distribution */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* MAIN CONTENT COLUMN */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10 thin-scrollbar">
            
            {/* Title Section */}
            <div className="group">
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.12em] mb-1.5 flex items-center gap-2">
                <AlignLeft size={13} className="text-slate-300"/> Task Title
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="Name of Task"
                className="w-full text-xl font-medium text-slate-700 border-b border-transparent focus:border-indigo-500/30 p-0 pb-1 focus:ring-0 placeholder:text-slate-200 bg-transparent transition-all duration-300"
              />
            </div>

            {/* Editor Section: More padding and a cleaner container */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                Detailed Description
              </label>
              <div className={`rounded-2xl border ${isViewMode ? 'bg-slate-50/50 p-8 border-slate-100' : 'border-slate-200 shadow-sm overflow-hidden bg-white'}`}>
                {isViewMode ? (
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: formData.description || '<p className="italic text-slate-400">No content provided.</p>' }} />
                ) : (
                  <div className="min-h-[350px]">
                    <CKEditor
                      editor={ClassicEditor}
                      data={formData.description}
                      onChange={(_, editor) => setFormData(p => ({ ...p, description: editor.getData() }))}
                      config={{
                        toolbar: ["heading", "bold", "italic", "link", "bulletedList", "numberedList", "undo", "redo"],
                        plugins: [Bold, Essentials, Heading, Indent, IndentBlock, Italic, Link, List, MediaEmbed, Paragraph, Table, Undo],
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR (RIGHT): Compact metadata alignment */}
          <div className="w-80 bg-slate-50/30 border-l border-slate-100 p-10 space-y-8 overflow-y-auto hidden lg:block">
            <div className="space-y-6">
              
              {/* Status & Priority: Medium weight text with crisp borders */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Tag size={14} className="text-indigo-500"/> Current Status
                </label>
                <select name="status" value={formData.status} onChange={handleChange} disabled={isViewMode} className={inputClass}>
                  <option value="">Choose status...</option>
                  {statuses.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Flag size={14} className="text-rose-500"/> Priority Level
                </label>
                <select name="priority" value={formData.priority} onChange={handleChange} disabled={isViewMode} className={inputClass}>
                  <option value="">Set Priority...</option>
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>

              {/* Date Section: Vertically stacked to save horizontal space */}
              <div className="pt-6 border-t border-slate-200/60 space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400"/> Starting On
                  </label>
                  <input name="start_date" type="date" value={formData.start_date} onChange={handleChange} disabled={isViewMode} className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400"/> Deadline
                  </label>
                  <input name="end_date" type="date" value={formData.end_date} onChange={handleChange} disabled={isViewMode} className={inputClass} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between">
          <div>
            {(mode === "view" || mode === "edit") && task?.id && (
              <button
                onClick={() => { handleDeleteTask(task.id); onClose(); }}
                className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                <Trash2 size={16} /> Delete Task
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleOnClose} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              Discard
            </button>
            
            {mode === "view" ? (
              <button
                onClick={() => task && handleEditTask(task)}
                className="bg-slate-900 hover:bg-black text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <Edit3 size={16} /> Edit Task
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-xl text-sm transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save size={16} /> {mode === "add" ? "Create Task" : "Save Changes"}</>
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