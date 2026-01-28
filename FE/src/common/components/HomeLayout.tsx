import { useDispatch, useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../modules/auth/slices/AuthSlice";
import { 
  LayoutDashboard, 
  LogOut, 
  UserCircle, 
  CheckSquare, 
  Activity, 
  // UserPlus, 
  BarChart2, 
  ShieldCheck,
  // ChevronRight
} from "lucide-react";

const HomeLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { role } = useSelector((state: RootState) => state.auth);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/50" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen flex bg-slate-50/50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 px-6 py-8 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-100">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Task Vault</h1>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-4 mb-3">Core Menu</p>
              <nav className="space-y-1.5">
                <NavLink to="task" className={navLinkClasses}>
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5" />
                    <span>Tasks</span>
                  </div>
                </NavLink>

                <NavLink to="status" className={navLinkClasses}>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5" />
                    <span>Status</span>
                  </div>
                </NavLink>

                {/* {role === "admin" && (
                  <NavLink to="invite" className={navLinkClasses}>
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-5 h-5" />
                      <span>Invite</span>
                    </div>
                  </NavLink>
                )} */}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-4 mb-3">Analytics</p>
              <nav className="space-y-1.5">
                <NavLink to="dashboard/me" end className={navLinkClasses}>
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-5 h-5" />
                    <span>Personal Board</span>
                  </div>
                </NavLink>
                {role === "admin" && (
                  <NavLink to="dashboard" end className={navLinkClasses}>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Admin Board</span>
                    </div>
                  </NavLink>
                )}
              </nav>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-3">
          <NavLink to="profile" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
              <UserCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="leading-none text-slate-900 truncate">My Profile</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{role}</p>
            </div>
          </NavLink>

          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all group cursor-pointer"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HomeLayout;