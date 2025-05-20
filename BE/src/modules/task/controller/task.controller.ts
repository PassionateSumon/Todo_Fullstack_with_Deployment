import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  createTaskService,
  deleteTaskService,
  getAllTaskService,
  getSingleTaskService,
  updateTaskService,
} from "../service/task.service";
import { error, success } from "common/utils/returnFunctions";

export const createTaskHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const { userId } = req.auth.credentials as any;
    const payload = req.payload as {
      name: string;
      description?: string;
      status: string;
      priority?: "high" | "medium" | "low";
      start_date?: string;
      end_date?: string;
    };
    // console.log(payload)
    const result = await createTaskService(payload, userId);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    // console.log("here clear");
    return success(result.data, "Task created successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const getAllTaskHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const viewType = req.params.viewType as "kanban" | "compact" | "calendar";
    // console.log("controller viewType: --> ",viewType)
    const result = await getAllTaskService(viewType);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    // console.log("res ---> ", result.data); 
    return success(result.data, "Tasks fetched successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const getSingleTaskHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.params.id as number;
    const result = await getSingleTaskService({ id });
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "Task fetched successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const updateTaskHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = req.params.id as number;
    const payload = req.payload as {
      name?: string;
      description?: string;
      status?: string;
    };
    const result = await updateTaskService(id, payload);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "Task updated successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const deleteTaskHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = req.params.id as number;
    const result = await deleteTaskService(id);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "Status deleted successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};
