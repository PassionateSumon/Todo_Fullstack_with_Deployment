import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { getDashboardData } from "../slices/dashboardSlice";
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
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    dispatch(getDashboardData()).then((res: any) => {
      setData(res.payload);
    });
  }, [dispatch]);

  if (!data)
    return (
      <DotLoader
        cssOverride={{ position: "fixed", top: "50%", left: "50%" }}
        speedMultiplier={1}
      />
    );

  return (
    <div className="bg-[#F3F4FE] h-[94vh] overflow-y-auto thin-scrollbar p-6 text-[#2D3748] cursor-pointer ">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 ">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold text-lg">Active Users</h2>
          <p className="text-2xl mt-2">{data.activeUsers}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold text-lg">Total Tasks</h2>
          <p className="text-2xl mt-2">{data.totalTasks}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-semibold text-lg">Overdue Tasks</h2>
          <p className="text-2xl mt-2">{data.overdueTasks}</p>
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
                  { name: "High", value: data?.tasksByPriority?.high },
                  { name: "Medium", value: data?.tasksByPriority?.medium },
                  { name: "Low", value: data?.tasksByPriority?.low },
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
            <BarChart data={data.tasksByStatus}>
              <XAxis dataKey="statusName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasksCount" fill="#5A67D8" radius={[4, 4, 0, 0]} className="cursor-pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <h2 className="font-semibold text-lg mb-4">Recent Task</h2>
        {data.recentTasks.length === 0 ? (
          <p>No recent tasks.</p>
        ) : (
          <div className="space-y-2">
            {data.recentTasks.map((task: any) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg border-[#CBD5E0]"
              >
                <h3 className="font-semibold text-lg">{task.task_name}</h3>
                <p>{task.task_description}</p>
                <p className="text-sm text-[#38B2AC]">
                  Assigned to: {task.user.name}
                </p>
                <p className="text-sm">Status: {task.status.name}</p>
                <p className="text-sm">Priority: {task.priority}</p>
              </div>
            ))}
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
            <BarChart data={data.monthlyTasks}>
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
            <BarChart data={data.weeklyTasks}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
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
            <BarChart data={data.yearlyTasks}>
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
    </div>
  );
};

export default AdminDashboard;
