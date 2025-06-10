import { error, success } from "../../../common/utils/returnFunctions";
import {
  deleteUserService,
  getAllUsersService,
  getSingleUserService,
  toggleActiveService,
  updateDetailsService,
} from "../service/user.service";
import { Request, ResponseToolkit } from "@hapi/hapi";

export const getAllUsersHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const {userId} = req.auth.credentials as any;
    const result = await getAllUsersService(userId);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "Users fetched successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const getSingleUserHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.params.id as number;
    const { userId } = req.auth.credentials as any;
    const result = await getSingleUserService(id, userId);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "User fetched successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const toggleActiveHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = req.params.id as number;
    const result = await toggleActiveService(id);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "User fetched successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const updateDetailsHandler = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const {userId} = req.auth.credentials as any;
    const payload = req.payload as { name: string };
    const result = await updateDetailsService(userId, payload);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "User fetched successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};

export const deleteUserHandler = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = req.params.id as number;
    const result = await deleteUserService(id);
    if (result.statusCode !== 200 && result.statusCode !== 201)
      return error(null, result.message, result.statusCode)(h);
    return success(result.data, "User deleted successfully", 200)(h);
  } catch (err: any) {
    return error(null, err.message || "Internal server error", 500)(h);
  }
};
