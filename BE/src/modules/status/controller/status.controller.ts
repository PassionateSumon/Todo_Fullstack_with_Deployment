import { Request, ResponseToolkit } from "@hapi/hapi";
import { error, success } from "../../../common/utils/returnFunctions.js";
import {
  createstatusService,
  deleteStatusService,
  getAllStatusService,
  updateStatusService,
} from "../service/status.service.js";

export const createStatusHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as any;
    const result = await createstatusService(payload);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "Status created successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const getAllStatusHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const result = await getAllStatusService();
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "Status fetched successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const updateStatusHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as { id: number, name: string }
    const result = await updateStatusService(payload);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "Status updated successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const deleteStatusHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as { id: number }
    const result = await deleteStatusService(payload);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "Status deleted successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};