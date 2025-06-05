import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { getDashboardData, toggleStatus } from "../slices/dashboardSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DotLoader } from "react-spinners";

const COLORS = ["#5A67D8", "#38B2AC", "#E53E3E"];

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardData, loading } = useSelector(
    (state: RootState) => state.dashboard
  ) as any;
  const [activeTab, setActiveTab] = useState<string>("stats");

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  const tabClasses = (tab: string) =>
    `py-2 px-4 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer
     ${activeTab === tab
      ? "bg-[#434190] text-white shadow-md scale-105"
      : "bg-[#5A67D8] hover:bg-[#434190] text-white"
    }`;

  const handleToggleUserStatus = (userId: number) => {
    dispatch(toggleStatus(userId));
  };

  if (loading || !dashboardData)
    return (
      <DotLoader
        cssOverride={{ position: "fixed", top: "50%", left: "50%" }}
        speedMultiplier={1}
      />
    );

  return (
    <div className="bg-[#F3F4FE] h-[94vh] overflow-y-auto thin-scrollbar p-6 text-[#2D3748] cursor-pointer ">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex justify-center items-center mb-6 space-x-8 ">
        <button
          className={tabClasses("stats")}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>
        <button
          className={tabClasses("users")}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      {activeTab === "stats" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 ">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold text-lg">Active Users</h2>
              <p className="text-2xl mt-2">{dashboardData.activeUsers}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold text-lg">Total Tasks</h2>
              <p className="text-2xl mt-2">{dashboardData.totalTasks}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold text-lg">Overdue Tasks</h2>
              <p className="text-2xl mt-2">{dashboardData.overdueTasks}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6 cursor-pointer">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Tasks By Priority</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[
                      {
                        name: "High",
                        value: dashboardData?.tasksByPriority?.high,
                      },
                      {
                        name: "Medium",
                        value: dashboardData?.tasksByPriority?.medium,
                      },
                      { name: "Low", value: dashboardData?.tasksByPriority?.low },
                      {
                        name: "No priority",
                        value: dashboardData?.tasksByPriority?.null,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    className="cursor-pointer"
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Tasks By Status</h2>
              <ResponsiveContainer
                width="100%"
                height={250}
                className="cursor-pointer"
              >
                <BarChart data={dashboardData.tasksByStatus}>
                  <XAxis dataKey="statusName" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="tasksCount"
                    fill="#5A67D8"
                    radius={[4, 4, 0, 0]}
                    className="cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 mb-6">
            <h2 className="font-semibold text-lg mb-4">Recent Task</h2>
            {dashboardData?.recentTasks?.length === 0 ? (
              <p>No recent tasks.</p>
            ) : (
              <div className="space-y-2">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-x-hidden overflow-y-auto shadow-sm">
                  <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700 ">
                    <tr>
                      <td className="px-4 py-2">Task Name</td>
                      <td className="px-4 py-2">Task Description</td>
                      <td className="px-4 py-2">Task Created</td>
                      <td className="px-4 py-2">Task Status</td>
                      <td className="px-4 py-2">Task Priority</td>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {dashboardData?.recentTasks?.map((task: any) => (
                      <tr
                        key={task.id}
                        className="p-4 border rounded-lg border-[#CBD5E0]"
                      >
                        <td className="px-4 py-2 font-semibold text-md text-gray-900">
                          {task.task_name}
                        </td>
                        <td className="px-4 py-2 text-gray-700 ">
                          {task.task_description || "No Description"}
                        </td>
                        <td className="px-4 py-2 text-sm text-teal-700">
                          {task.user.name}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold">
                            {task.status.name}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={`inline-block px-2 py-1 rounded text-sm ${task.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : task.priority === null
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-green-100 text-green-800"
                              } `}
                          >
                            {task.priority || "No Priority"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Monthly Tasks</h2>
              <ResponsiveContainer
                width="100%"
                height={200}
                className="cursor-pointer"
              >
                <BarChart data={dashboardData.monthlyTasks}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#38B2AC"
                    radius={[4, 4, 0, 0]}
                    className=" cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Weekly Tasks</h2>
              <ResponsiveContainer
                width="100%"
                height={200}
                className="cursor-pointer"
              >
                <BarChart data={dashboardData.weeklyTasks} barCategoryGap={"20%"}>
                  <XAxis
                    dataKey="week"
                    tickFormatter={(week: any) => `Week ${week}`}
                  />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const { week, count } = payload[0].payload;
                        return (
                          <div className="bg-white p-2 rounded shadow text-sm">
                            <p className="font-semibold">Week {week}</p>
                            <p className="text-[#434190]">Tasks: {count}</p>
                          </div>
                        );
                      }
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#434190"
                    radius={[4, 4, 0, 0]}
                    className=" cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Yearly Tasks</h2>
              <ResponsiveContainer
                width="100%"
                height={200}
                className="cursor-pointer"
              >
                <BarChart data={dashboardData.yearlyTasks}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#5A67D8"
                    radius={[4, 4, 0, 0]}
                    className=" cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === "users" && (
        <>
          <div className="bg-white rounded-2xl shadow p-4 mb-6">
            <h2 className="font-semibold text-lg mb-4">All Users</h2>
            {dashboardData?.allIsActiveUsers?.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="space-y-2">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700 ">
                    <tr>
                      <td className="px-4 py-2">ID</td>
                      <td className="px-4 py-2">Name</td>
                      <td className="px-4 py-2">Email</td>
                      <td className="px-4 py-2">Status</td>
                      <td className="px-4 py-2">Toggle Status</td>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {dashboardData?.allIsActiveUsers?.map((user: any) => (
                      <tr
                        key={user.id}
                        className="p-4 border rounded-lg border-[#CBD5E0]"
                      >
                        <td className="px-4 py-2 font-semibold text-md text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-4 py-2 text-gray-700 ">{user.name}</td>
                        <td className="px-4 py-2 text-sm text-teal-700">
                          {user.email}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {user.isActive ? (
                            <span className="inline-block bg-green-100 text-green-800 rounded-md px-2 py-1 text-xs font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="inline-block bg-red-100 text-red-800 rounded-full px-2 py-1 text-xs font-semibold">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={handleToggleUserStatus.bind(null, user.id)}
                            className={`px-2 py-2 rounded-lg text-[12px] font-semibold transition-colors ${user.isActive
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                              } cursor-pointer `}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;