import Joi from "joi";
import {
  deleteUserHandler,
  getAllUsersHandler,
  getSingleUserHandler,
  toggleActiveHandler,
  updateDetailsHandler,
} from "../controller/user.controller";
import { JWTUtil } from "common/utils/JWTUtils";

const prefix = "/user";
export default [
  {
    method: "GET",
    path: `${prefix}/all`,
    handler: getAllUsersHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "user"],
      description: "Get all users",
    },
  },
  {
    method: "GET",
    path: `${prefix}/single/:id`,
    handler: getSingleUserHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "user"],
      description: "Get single user",
    },
  },
  {
    method: "PUT",
    path: `${prefix}/update/:id`,
    handler: updateDetailsHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "user"],
      description: "Update details of user",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: "PUT",
    path: `${prefix}/toggle-active/{id}`,
    handler: toggleActiveHandler,
    options: {
      auth: "jwt_access",
      pre: [JWTUtil.verifyRole()],
      tags: ["api", "user"],
      description: "Toggle active of user",
      payload: {
        parse: true,
        output: "data",
      }
    }
  },
  {
    method: "DELETE",
    path: `${prefix}/delete/:id`,
    handler: deleteUserHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "user"],
      description: "Delete user",
    },
  },
];
