import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  dashBoardHandler,
  dashBoardHandlerForUser,
} from "../controller/dashboard.controller";
import Joi from "joi";
import { JWTUtil } from "../../../common/utils/JWTUtils";

// const prefix = "/admin";

export default [
  {
    method: "GET",
    path: `/admin/dashboard`,
    handler: dashBoardHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "dashboard"],
      pre: [JWTUtil.verifyRole()],
      validate: {
        query: Joi.object({
          startDate: Joi.date()
            .iso()
            .optional()
            .description(
              "Start date for filtering dashboard data (ISO format)"
            ),
          endDate: Joi.date()
            .iso()
            .optional()
            .greater(Joi.ref("startDate"))
            .description("End date for filtering dashboard data (ISO format)"),
        }),
        failAction: (request: Request, h: ResponseToolkit, err: any) => {
          return h
            .response({
              statusCode: 400,
              message: "Validation error",
              data: err.details,
            })
            .code(400)
            .takeover();
        },
      },
    },
  },
  {
    method: "GET",
    path: `/dashboard/me`,
    handler: dashBoardHandlerForUser,
    options: {
      auth: "jwt_access",
      tags: ["api", "dashboard"],
      validate: {
        failAction: (request: Request, h: ResponseToolkit, err: any) => {
          return h
            .response({
              statusCode: 400,
              message: "Validation error",
              data: err.details,
            })
            .code(400)
            .takeover();
        },
      },
    },
  },
];
