import { useDispatch, useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../modules/auth/slices/AuthSlice";

const HomeLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { role } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen h-[100vh] flex bg-gray-100 overflow-y-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 cursor-pointer text-left">Task Valut</h2>
          <nav className="space-y-2">
            <NavLink
              to="task"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-[#5A67D8] hover:bg-[#434190] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Tasks
            </NavLink>

            <NavLink
              to="status"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-[#5A67D8] hover:bg-[#434190] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Status
            </NavLink>

            <NavLink
              to="dashboard/me"
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-[#5A67D8] hover:bg-[#434190] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Dashboard
            </NavLink>

            {role === "admin" && (
              <NavLink
                to="dashboard"
                end
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-[#5A67D8] hover:bg-[#434190] text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                Admin Dashboard
              </NavLink>
            )}
          </nav>
        </div>

        <div className="pt-6">
          <button
            className="w-full px-4 py-2 rounded-md text-base font-medium bg-[#5A67D8] hover:bg-[#434190] text-white cursor-pointer text-center "
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
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
