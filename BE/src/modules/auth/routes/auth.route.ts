import {
  loginHandler,
  logoutHandler,
  resetPasswordHandler,
  signupHandler,
} from "../controller/auth.controller";
import Joi from "joi";

const prefix = "/auth";

export default [
  {
    method: "POST",
    path: `${prefix}/signup`,
    handler: signupHandler,
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "User signup",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          user_type: Joi.string().required(),
        }),
      },
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "POST",
    path: `${prefix}/login`,
    handler: loginHandler,
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "User login",
      validate: {
        payload: Joi.object({
          emailOrUsername: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "PUT",
    path: `${prefix}/reset-password`,
    handler: resetPasswordHandler,
    options: {
      auth: false,
      tags: ["api", "auth"],
      description: "Password reset",
      validate: {
        payload: Joi.object({
          emailOrUsername: Joi.string().required(),
          tempPassword: Joi.string().required(),
          newPassword: Joi.string().required(),
        }),
      },
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "POST",
    path: `${prefix}/logout`,
    handler: logoutHandler,
    options: {
      auth: "jwt_access",
      tags: ["api", "auth"],
      description: "User logout",
    },
  },
];
