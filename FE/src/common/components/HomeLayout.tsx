import { useDispatch, useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../modules/auth/slices/AuthSlice";
import { ListTodo, LayoutDashboard, LogOut, User } from "lucide-react";


const HomeLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { role } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen h-[100vh] flex bg-gray-100 overflow-y-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-6">
            <LayoutDashboard className="w-8 h-8 text-indigo-600 mr-2" />
            <NavLink to="task" className="text-xl font-semibold text-gray-800">Task Valut</NavLink>
          </div>
          <nav className="space-y-1 text-sm font-medium">
            <NavLink
              to="task"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium ${isActive
                  ? "bg-[#5A67D8] text-white shadow-sm border-l-4 border-indigo-900 pl-3"
                  : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <ListTodo className="w-4 h-4 mr-2 inline" />
              <span>
                Tasks
              </span>
            </NavLink>

            <NavLink
              to="status"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium ${isActive
                  ? "bg-[#5A67D8] text-white shadow-sm border-l-4 border-indigo-900 pl-3"
                  : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <ListTodo className="w-4 h-4 mr-2 inline" />
              <span>
                Status
              </span>
            </NavLink>

            {role === "admin" && (<NavLink
              to="invite"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium ${isActive
                  ? "bg-[#5A67D8] text-white shadow-sm border-l-4 border-indigo-900 pl-3"
                  : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <ListTodo className="w-4 h-4 mr-2 inline" />
              <span>
                Invite
              </span>
            </NavLink>)}

            <NavLink
              to="dashboard/me"
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium ${isActive
                  ? "bg-[#5A67D8] text-white shadow-sm border-l-4 border-indigo-900 pl-3"
                  : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <ListTodo className="w-4 h-4 mr-2 inline" />
              <span>
                Personal Dashboard
              </span>
            </NavLink>

            {role === "admin" && (
              <NavLink
                to="dashboard"
                end
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-base font-medium ${isActive
                    ? "bg-[#5A67D8] text-white shadow-sm border-l-4 border-indigo-900 pl-3"
                    : "text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                <ListTodo className="w-4 h-4 mr-2 inline" />
                <span>
                  Admin Dashboard
                </span>
              </NavLink>
            )}
          </nav>
        </div>

        <div className="pt-6 flex flex-col space-y-2">
          <NavLink
            to="profile"
            end
            className="w-full px-4 py-2 rounded-md text-base font-medium bg-[#5A67D8] hover:bg-[#434190] text-white cursor-pointer text-center border-x-4 border-indigo-900 "
          >
            <User className="w-4 h-4 mr-2 inline" />
            <span> Profile </span>
          </NavLink>

          <button
            className="w-full px-4 py-2 rounded-md text-base font-medium bg-[#5A67D8] hover:bg-[#434190] text-white cursor-pointer text-center border-x-4 border-indigo-900 "
            onClick={() => {
              dispatch(logout());
            }}
          >
            <LogOut className="w-4 h-4 mr-2 inline" />
            <span>
              Logout
            </span>
          </button>
        </div>


      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
