import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteStatus, getAllStatuses } from "../slices/StatusSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import StatusModal from "../components/StatusModal";
import { Plus, Pencil, Trash2, Search, Hash } from "lucide-react";
import DeleteConfirmModal from "../../../common/components/DeleteConfirmModal";

const StatusPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { statuses } = useSelector((state: RootState) => state.status);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    status: any;
  }>({ isOpen: false, mode: "add", status: null });

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    statusId: number | null;
    statusName: string | null;
  }>({ isOpen: false, statusId: null, statusName: null });

  useEffect(() => {
    dispatch(getAllStatuses());
  }, [dispatch]);

  // Dynamic color helper
  const getStatusColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('pending') || n.includes('wait')) return 'bg-amber-400';
    if (n.includes('complete') || n.includes('done') || n.includes('final')) return 'bg-emerald-500';
    if (n.includes('block') || n.includes('stop')) return 'bg-rose-500';
    if (n.includes('progress') || n.includes('new')) return 'bg-blue-500';
    return 'bg-slate-400';
  };

  const filteredStatuses = statuses?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Status</h1>
            <p className="text-slate-500 text-sm mt-1">Create your own status here.</p>
          </div>
          <button
            onClick={() => setModalState({ isOpen: true, mode: "add", status: null })}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm shadow-indigo-200 cursor-pointer active:scale-95"
          >
            <Plus size={18} />
            <span>Add Status</span>
          </button>
        </div>

        {/* List Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Internal Toolbar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search statuses..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {filteredStatuses?.length} Total
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-slate-50/30 border-b border-slate-100">
            <div className="col-span-8 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Name</div>
            <div className="col-span-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</div>
          </div>

          {/* List Items */}
          <div className="divide-y divide-slate-100">
            {filteredStatuses?.length > 0 ? (
              filteredStatuses.map((status) => (
                <div 
                  key={status.id} 
                  className="grid grid-cols-12 items-center px-6 py-4 hover:bg-indigo-50/20 transition-colors group"
                >
                  <div className="col-span-8 flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status.name)} shadow-sm`} />
                    <span className="text-sm font-semibold text-slate-700">{status.name}</span>
                  </div>
                  
                  <div className="col-span-4 flex justify-end items-center gap-2">
                    <button
                      onClick={() => setModalState({ isOpen: true, mode: "edit", status })}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteState({ isOpen: true, statusId: Number(status.id), statusName: status.name })}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4">
                  <Hash className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-500 font-medium">No statuses found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={modalState.isOpen}
        handleClose={() => setModalState({ ...modalState, isOpen: false })}
        mode={modalState.mode}
        status={modalState.status}
      />

      <DeleteConfirmModal
        isOpen={deleteState.isOpen}
        title="Delete Status"
        message={`Are you sure you want to delete this status? All associated tasks with "${deleteState.statusName}" will be deleted.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setDeleteState({ isOpen: false, statusId: null, statusName: null })}
        onConfirm={() => {
          if (deleteState.statusId != null) {
            dispatch(deleteStatus({ id: deleteState.statusId }));
          }
          setDeleteState({ isOpen: false, statusId: null, statusName: null });
        }}
      />
    </div>
  );
};

export default StatusPage;