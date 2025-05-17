import Joi from "joi";
import {
  createStatusHandler,
  deleteStatusHandler,
  getAllStatusHandler,
  updateStatusHandler,
} from "../controller/status.controller";

const prefix = "/status";

export default [
  {
    method: "POST",
    path: `${prefix}/create`,
    handler: createStatusHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "status"],
      description: "User signup",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
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
    path: `${prefix}/all`,
    handler: getAllStatusHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "status"],
      description: "Get all status",
    },
  },
  {
    method: "PUT",
    path: `${prefix}/update`,
    handler: updateStatusHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "status"],
      description: "Update status",
      validate: {
        payload: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
        }),
      },
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "DELETE",
    path: `${prefix}/delete`,
    handler: deleteStatusHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "status"],
      description: "Delete status",
      validate: {
        payload: Joi.object({
          id: Joi.number().required(),
        }),
      },
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
];
