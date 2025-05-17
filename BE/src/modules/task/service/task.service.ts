import { db } from "config/db";

export const createTaskService = async (
  {
    name,
    description,
    status,
  }: {
    name: string;
    description?: string;
    status: string;
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
    };

    const result = await db.Task.create(wrappedInput);
    if (!result) {
      return {
        statusCode: 400,
        message: "Task creation failed",
      };
    }
    // console.log(result)
    return {
      statusCode: 200,
      message: "Task created successfully",
      data: result,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
};

export const getAllTaskService = async (
  viewType: "kanban" | "compact" = "compact"
) => {
  try {
    const tasks = await db.Task.findAll({
      attributes: ["id", "task_name", "task_description", "status_id"],
      include: [{ model: db.Status, attributes: ["id", "name"] }],
    });

    let result;

    if (viewType === "kanban") {
      result = tasks.reduce((acc: any, task: any) => {
        const status = task.status.name;
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        return acc;
      }, {});
    } else {
      result = tasks;
    }

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
    const result = await db.Task.findOne({ where: { id } });
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

export const updateTaskService = async (id: number, {
  name,
  description,
  status,
}: {
  name?: string;
  description?: string;
  status?: string;
}) => {
  try {
    const task = await db.Task.findOne({ where: { id } });
    if (!task) {
      return {
        statusCode: 404,
        message: "Task not found",
      };
    }
    const updatedData = {
      task_name: name ? name : task.task_name,
      task_description: description ? description : task.task_description,
      status_id: status ? status : task.status_id,
    };
    await db.Task.update(updatedData, { where: { id } });
    const finalRes = await db.Task.findOne({ where: { id } });
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
