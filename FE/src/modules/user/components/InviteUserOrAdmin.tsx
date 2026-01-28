import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { signup } from "../../auth/slices/AuthSlice";
import { AlertCircle } from "lucide-react";

const InviteUserOrAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<any>({
    name: '',
    email: '',
    user_type: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = e.target.value;
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setData({
      ...data,
      user_type: value,
    });
  };

  const handleSubmit = () => {
    if (!data.name || !data.email || !data.user_type) {
      setError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      setError("Invalid email format.");
      return;
    }

    const password = Math.random().toString(36).slice(-8);
    const userData = {
      name: data.name,
      email: data.email,
      password: password,
      user_type: data.user_type,
    };

    dispatch(signup(userData));
    setError(null);
    setData({
      name: '',
      email: '',
      user_type: '',
    });
  }

  return (
    <div className="flex flex-col w-full min-h-[60vh] animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Invite Team Members</h1>
        <p className="text-slate-500 mt-1 font-medium">Add new users or administrators to your workspace.</p>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200">
        <div className="flex flex-col lg:flex-row items-end gap-6">
          
          {/* Name Field */}
          <div className="flex-1 w-full space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="John Doe" 
                value={data.name} 
                onChange={(e) => handleInputChange(e, "name")} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex-1 w-full space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com" 
              value={data.email} 
              onChange={(e) => handleInputChange(e, "email")} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300" 
            />
          </div>

          {/* Role Field */}
          <div className="w-full lg:w-1/5 space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Assign Role</label>
            <select 
              value={data.user_type} 
              onChange={handleRoleChange} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mb-[1px]" 
          >
            <span>Send Invitation</span>
          </button>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mt-6 flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in slide-in-from-top-2">
            <AlertCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default InviteUserOrAdmin;