import { db } from "config/db";
import { statusCodes } from "common/constants/constants";

const priorities = ["high", "medium", "low"];

const getDashBoardService = async () => {
  try {
    const { User, Task, Status, sequelize } = db;
    const currentDate = new Date();

    // 1. Count active users (excluding admins)
    const activeUsersCount = await User.count({
      where: { isActive: true, user_type: "user" },
    });

    // 2. Total tasks
    const totalTasks = await Task.count();

    // 3. Tasks grouped by status
    const tasksByStatusRaw = await Status.findAll({
      attributes: ["id", "name"],
      include: [{ model: db.Task, as: "tasks" }],
      // group: ["Status.id", "Status.name"],
      // raw: true,
    });
    // console.log(JSON.stringify(tasksByStatusRaw));

    // 4. Tasks grouped by priority
    const tasksByPriorityRaw = await Task.findAll({
      attributes: ["priority", [sequelize.literal("COUNT(*)"), "count"]],
      group: "priority",
      raw: true,
    });

    // 5. Overdue tasks
    const overdueTasks = await Task.count({
      where: { end_date: { [db.Sequelize.Op.lt]: currentDate } },
      include: [
        {
          model: db.Status,
          as: "status",
          where: { name: { [db.Sequelize.Op.notIn]: ["Done", "Completed"] } },
        },
      ],
    });

    // 6. Recent tasks (last 5)
    const recentTasks = await Task.findAll({
      attributes: [
        "id",
        "task_name",
        "task_description",
        "priority",
        "start_date",
        "end_date",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "name", "email", "username"],
        },
        { model: db.Status, as: "status", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
      raw: true,
      nest: true,
    });

    // 7. Recent users (last 5, excluding sensitive fields)
    const recentUsers = await User.findAll({
      attributes: { exclude: ["password", "otp"] },
      where: { user_type: "user" },
      order: [["createdAt", "DESC"]],
      limit: 5,
      raw: true,
    });

    // 8. Monthly task report (current year)
    const currentYear = currentDate.getFullYear();
    const monthlyTasks = await Task.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "month",
        ],
        [sequelize.literal("COUNT(*)"), "count"],
      ],
      where: {
        createdAt: {
          [db.Sequelize.Op.gte]: new Date(currentYear, 0, 1),
          [db.Sequelize.Op.lte]: new Date(currentYear, 11, 31, 23, 59, 59, 999),
        },
      },
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m")],
      raw: true,
    });

    // 9. Weekly task report (current month)
    const currentMonth = currentDate.getMonth();
    const weeklyTasks = await Task.findAll({
      attributes: [
        [sequelize.fn("YEARWEEK", sequelize.col("createdAt"), 1), "week"],
        [sequelize.literal("COUNT(*)"), "count"],
      ],
      where: {
        createdAt: {
          [db.Sequelize.Op.gte]: new Date(currentYear, currentMonth, 1),
          [db.Sequelize.Op.lte]: new Date(
            currentYear,
            currentMonth + 1,
            0,
            23,
            59,
            59,
            999
          ),
        },
      },
      group: [sequelize.fn("YEARWEEK", sequelize.col("createdAt"), 1)],
      raw: true,
    });

    // 10. Yearly task report
    const yearlyTasks = await Task.findAll({
      attributes: [
        [sequelize.fn("YEAR", sequelize.col("createdAt")), "year"],
        [sequelize.literal("COUNT(*)"), "count"],
      ],
      group: [sequelize.fn("YEAR", sequelize.col("createdAt"))],
      raw: true,
    });

    // 11. Task completion rate
    const completedTasks = await Task.count({
      include: [
        {
          model: db.Status,
          as: "status",
          where: { name: { [db.Sequelize.Op.in]: ["Done", "Completed"] } },
        },
      ],
    });
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // 12. Tasks per user
    const tasksPerUser = await Task.findAll({
      attributes: [
        [sequelize.col("user.id"), "userId"],
        [sequelize.col("user.name"), "userName"],
        [sequelize.literal("COUNT(*)"), "taskCount"],
      ],
      include: [
        {
          model: db.User,
          as: "user",
          attributes: [],
          where: { user_type: "user" },
        },
      ],
      group: ["user.id", "user.name"],
      raw: true,
    });

    // 13. Average task duration (completed tasks)
    const avgTaskDuration = await Task.findOne({
      attributes: [
        [
          sequelize.fn(
            "AVG",
            sequelize.fn(
              "TIMESTAMPDIFF",
              sequelize.literal("DAY"),
              sequelize.col("start_date"),
              sequelize.col("end_date")
            )
          ),
          "avgDurationDays",
        ],
      ],
      where: {
        start_date: { [db.Sequelize.Op.ne]: null },
        end_date: { [db.Sequelize.Op.ne]: null },
      },
      include: [
        {
          model: db.Status,
          as: "status",
          where: { name: { [db.Sequelize.Op.in]: ["Done", "Completed"] } },
          attributes: [],
        },
      ],
      raw: true,
    });

    // 14. Task status trends (tasks moved to Done/Completed in last 30 days, non-raw)
    const statusTrends = await Task.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("Task.updatedAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("Task.id")), "count"],
      ],
      where: {
        updatedAt: {
          [db.Sequelize.Op.gte]: new Date(
            currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
          ),
        },
      },
      include: [
        {
          model: Status,
          as: "status",
          where: { name: { [db.Sequelize.Op.in]: ["Done", "Completed"] } },
          attributes: [],
        },
      ],
      group: [sequelize.fn("DATE", sequelize.col("Task.updatedAt"))],
    });

    // 15. Active users in last 30 days (users who created or updated tasks, non-raw)
    const activeUsersLast30Days = await User.count({
      where: { user_type: "user" },
      include: [
        {
          model: Task,
          as: "tasks",
          where: {
            [db.Sequelize.Op.or]: [
              {
                createdAt: {
                  [db.Sequelize.Op.gte]: new Date(
                    currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
                  ),
                },
              },
              {
                updatedAt: {
                  [db.Sequelize.Op.gte]: new Date(
                    currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
                  ),
                },
              },
            ],
          },
          attributes: [],
          required: true,
        },
      ],
      distinct: true,
    });

    // Format response
    const dashboardData: any = {
      activeUsers: activeUsersCount,
      totalTasks,
      tasksByStatus: tasksByStatusRaw.map((status: any) => ({
        statusId: status.id,
        statusName: status.name,
        tasksCount: status.tasks.length,
      })),
      tasksByPriority: priorities.reduce((acc, priority) => {
        const found = tasksByPriorityRaw.find(
          (item: any) => item.priority === priority
        );
        acc[priority] = found ? parseInt(found.count, 10) : 0;
        return acc;
      }, {} as Record<string, number>),
      overdueTasks,
      recentTasks,
      recentUsers,
      monthlyTasks,
      weeklyTasks,
      yearlyTasks,
      completionRate: parseFloat(completionRate.toFixed(2)),
      tasksPerUser,
      avgTaskDurationDays: avgTaskDuration?.avgDurationDays
        ? parseFloat(avgTaskDuration?.avgDurationDays)
        : null,
      statusTrends,
      activeUsersLast30Days,
    };

    return {
      statusCode: statusCodes.SUCCESS,
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
    };
  } catch (err: any) {
    console.error("Error in getDashBoardService:", err);
    return {
      statusCode: statusCodes.SERVER_ISSUE,
      message: err.message || "Internal server error",
    };
  }
};

const getDashBoardServiceForUser = async (userId: number) => {
  try {
    const { Task, Status, sequelize } = db;
    const tasks = await Task.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Status,
          as: "status",
        },
      ],
    });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task: any) =>
        task.status.name === "Done" || task.status.name === "Completed"
    ).length;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const pendingTasks = tasks.filter(
      (task: any) =>
        task.status.name !== "Done" && task.status.name !== "Completed"
    ).length;
    const overdueTasks = tasks.filter(
      (task: any) =>
        task.end_date < new Date() &&
        task.status.name !== "Done" &&
        task.status.name !== "Completed"
    ).length;

    return {
      statusCode: statusCodes.SUCCESS,
      message: "User dashboard data retrieved successfully",
      data: {
        totalTasks,
        completedTasks,
        completionRate: parseFloat(completionRate.toFixed(2)),
        pendingTasks,
        overdueTasks,
      },
    };
  } catch (error: any) {
    return {
      statusCode: statusCodes.SERVER_ISSUE,
      message: error.message || "Internal server error",
    };
  }
};

export { getDashBoardService, getDashBoardServiceForUser };
