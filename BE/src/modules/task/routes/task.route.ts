import Joi from "joi";
import {
  createTaskHandler,
  deleteTaskHandler,
  getAllTaskHandler,
  getSingleTaskHandler,
  updateTaskHandler,
} from "../controller/task.controller.js";
import { Request, ResponseToolkit } from "@hapi/hapi";

const prefix = "/task";

export default [
  {
    method: "POST",
    path: `${prefix}/create`,
    handler: createTaskHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "task"],
      description: "Create task",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          description: Joi.string().optional(),
          status: Joi.string().required(),
          priority: Joi.string().optional(),
          start_date: Joi.string().optional(),
          end_date: Joi.string().optional(),
        }),
      },
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "GET",
    path: `${prefix}/all/{viewType}/{id}`,
    handler: getAllTaskHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "task"],
      description: "Get all task",
    },
  },
  {
    method: "GET",
    path: `${prefix}/single/{id}`,
    handler: getSingleTaskHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "task"],
      description: "Get single task",
    },
  },
  {
    method: "PUT",
    path: `${prefix}/update/{id}`,
    handler: updateTaskHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "task"],
      description: "Update task",
      validate: {
        payload: Joi.object({
          name: Joi.string().optional(),
          description: Joi.string().optional(),
          status: Joi.string().optional(),
          priority: Joi.string().optional(),
          start_date: Joi.date().optional(),
          end_date: Joi.date().optional(),
        }).or(
          "name",
          "description",
          "status",
          "priority",
          "start_date",
          "end_date"
        ),
        failAction: (req: Request, h: ResponseToolkit, err: any) => {
          return h.response({ error: err.message }).code(400).takeover();
        },
      },
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "DELETE",
    path: `${prefix}/delete/{id}`,
    handler: deleteTaskHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "task"],
      description: "Delete task",
    },
  },
];
