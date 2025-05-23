import { db } from "config/db";

export const createTaskService = async (
  {
    name,
    description,
    status,
    priority,
    start_date,
    end_date,
  }: {
    name: string;
    description?: string;
    status: string;
    priority?: "high" | "medium" | "low";
    start_date?: string;
    end_date?: string;
  },
  userId: number
) => {
  try {
    const status_id = await db.Status.findOne({ where: { name: status } });
    if (!status_id) {
      return {
        statusCode: 404,
        message: "Status not found",
      };
    }
    const whereClause = {
      task_name: name,
      status_id,
      user_id: userId,
    };
    const existed = await db.Task.findOne({
      where: whereClause,
    });
    // console.log("existed: --> ", existed);
    if (existed) {
      return {
        statusCode: 409,
        message: "Task already exists",
      };
    }

    const wrappedInput = {
      task_name: name,
      description: description ? description : null,
      user_id: userId,
      status_id: status_id.id,
      priority: priority ? priority : null,
      start_date: start_date ? start_date : null,
      end_date: end_date ? end_date : null,
    };
    // console.log("wrapped i/p: ", wrappedInput)

    const result = await db.Task.create(wrappedInput);
    if (!result) {
      return {
        statusCode: 400,
        message: "Task creation failed",
      };
    }
    // console.log("res --> ", JSON.stringify(result))
    return {
      statusCode: 200,
      message: "Task created successfully",
      data: result,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const getAllTaskService = async (
  viewType: "kanban" | "compact" | "calendar" | "table" = "compact",
  userId: number,
  roleId: string,
  reqUserId?: string | null
) => {
  try {
    const tasks = await db.Task.findAll({
      where: { user_id: reqUserId !== "null" ? reqUserId : userId },
      attributes: [
        "id",
        "task_name",
        "task_description",
        "status_id",
        "priority",
        "start_date",
        "end_date",
      ],
      include: [{ model: db.Status, as: "status", attributes: ["id", "name"] }],
    });
    if (!tasks) return { statusCode: 404, message: "Tasks not found" };
    // console.log("93: ", tasks);

    let result = {};

    if (reqUserId === "null" || reqUserId === "undefined") {
      if (viewType === "kanban") {
        result = tasks.reduce((acc: any, task: any) => {
          // console.log("task --> ", JSON.stringify(task));
          const status = task.status.name;
          // console.log("status --> ",status)
          // console.log("acc-status --> ", JSON.stringify(acc[status]))
          if (!acc[status]) {
            acc[status] = [];
          }
          acc[status].push(task);
          // console.log("acc --> ", JSON.stringify(acc));
          return acc;
        }, {});
      } else if (viewType === "calendar") {
        // console.log("here")
        result = tasks.reduce((acc: any, task: any) => {
          const date = task.start_date ? task.start_date : "no-date";
          // console.log(date)
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(task);
          return acc;
        }, {});
      } else {
        result = tasks;
      }
    } else {
      if (roleId === "admin")
        result = tasks.filter((task: any) => task.user_id === reqUserId);
    }

    // console.log(result);
    // console.log(JSON.stringify(result));

    return {
      statusCode: 200,
      message: "Status fetched successfully",
      data: result,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
};

export const getSingleTaskService = async ({ id }: { id: number }) => {
  try {
    const result = await db.Task.findOne({
      where: { id },
      include: [{ model: db.Status, attributes: ["id", "name"] }],
    });
    if (!result) {
      return {
        statusCode: 404,
        message: "Task not found",
      };
    }
    return {
      statusCode: 200,
      message: "Task fetched successfully",
      data: result,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const updateTaskService = async (
  id: number,
  {
    name,
    description,
    status,
    priority,
    start_date,
    end_date,
  }: {
    name?: string;
    description?: string;
    status?: string;
    priority?: "high" | "medium" | "low";
    start_date?: string;
    end_date?: string;
  }
) => {
  try {
    console.log("id --> ", id);
    const task = await db.Task.findOne({ where: { id } });
    console.log(JSON.stringify(task));
    if (!task) {
      return {
        statusCode: 404,
        message: "Task not found",
      };
    }

    let status_id = task.status_id;
    if (status) {
      const statusRecord = await db.Status.findOne({ where: { name: status } });
      if (!statusRecord) {
        return {
          statusCode: 404,
          message: "Status not found",
        };
      }
      status_id = statusRecord.id;
    }
    console.log("status_id: --> ", status_id);

    const updatedData = {
      task_name: name ? name : task.task_name,
      task_description: description ? description : task.task_description,
      status_id: status_id,
      priority: priority !== undefined ? priority : task.priority,
      start_date: start_date !== undefined ? start_date : task.start_date,
      end_date: end_date !== undefined ? end_date : task.end_date,
    };
    console.log(updatedData);
    await db.Task.update(updatedData, { where: { id } });
    console.log("here");
    const finalRes = await db.Task.findOne({
      where: { id },
      include: [{ model: db.Status, as: "status", attributes: ["id", "name"] }],
    });
    // console.log(JSON.stringify(finalRes));
    return {
      statusCode: 200,
      message: "Status updated successfully",
      data: finalRes,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const deleteTaskService = async (id: number) => {
  try {
    const task = await db.Task.findOne({ where: { id } });
    if (!task) {
      return {
        statusCode: 404,
        message: "Task not found",
      };
    }
    await db.Task.destroy({ where: { id } });
    return {
      statusCode: 200,
      message: "Task deleted successfully",
      data: { id: id },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};
