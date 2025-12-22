import Hapi, { Request } from "@hapi/hapi";
import dotenv from "dotenv";
import Jwt from "@hapi/jwt";
import Cookie from "@hapi/cookie";
import jwt from "jsonwebtoken";
import { registerSwagger } from "./plugins/swagger.plugin.js";
import { ApiError } from "./common/utils/ApiError.js";
import { statusCodes } from "./common/constants/constants.js";
import { db, connectDB } from "./config/db.js";
import routesPlugin from "./plugins/routes.plugin.js";
dotenv.config();

const requiredEnvVars = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "COOKIE_SECRET",
  "PORT",
  "DEV_ORIGIN",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);
if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as { userId: string };
  } catch (err) {
    throw new ApiError("Invalid or expired token", 401);
  }
};

const validateAccess = async (req: Hapi.Request, token: string) => {
  try {
    // console.log("validate --> ",token)
    if (!token) {
      throw new ApiError("No accessToken found in Cookie!", 401);
    }
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      throw new ApiError("Access Secret is not found in environment!", 401);
    }
    // console.log("validate --> ",accessSecret)

    const decoded = verifyToken(token, accessSecret) as any;
    // console.log("validate --> ",decoded)

    const user = await db.User.findOne({
      where: { id: decoded?.userId },
    });
    // console.log("validate --> ",user)
    if (!user) {
      throw new ApiError("User not found!", 401);
    }

    return {
      isValid: true,
      credentials: { userId: decoded?.userId, roleId: decoded?.roleId },
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Internal server error at validate-access!", 500);
  }
};

const validateRefresh = async (req: Hapi.Request) => {
  try {
    const token = req.state.refreshToken;
    if (!token) {
      throw new ApiError(
        "No refreshToken found in Cookie!",
        statusCodes.UNAUTHORIZED
      );
    }
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) {
      throw new ApiError(
        "Refresh Secret not found in environment!",
        statusCodes.UNAUTHORIZED
      );
    }

    const decoded = verifyToken(token, refreshSecret) as any;

    const refreshToken = await db.RefreshToken.findOne({
      where: { token, userId: decoded.userId },
    });
    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new ApiError(
        "Invalid or expired refresh token!",
        statusCodes.UNAUTHORIZED
      );
    }

    const user = await db.User.findOne({
      where: { id: decoded.userId },
    });
    if (!user || !user.isActive) {
      throw new ApiError(
        "User not found or inactive!",
        statusCodes.UNAUTHORIZED
      );
    }

    return {
      isValid: true,
      credentials: { userId: decoded?.userId, roleId: decoded?.roleId },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Internal server error at validate-refresh!",
      statusCodes.SERVER_ISSUE
    );
  }
};

const ORIGIN =
  (process.env.NODE_ENV === "production"
    ? process.env.PROD_ORIGIN
    : process.env.DEV_ORIGIN) ?? "http://localhost:3000";

console.log("origin: ", ORIGIN)

const init = async () => {
  const server = Hapi.server({
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: [ORIGIN],
        credentials: true,
        additionalHeaders: [
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "X-Skip-Loader",
        ],
      },
      state: {
        parse: true,
        failAction: "error",
      },
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 1024 * 1024 * 10,
      },
    },
  });

  await server.register(Jwt);
  await server.register(Cookie);
  await registerSwagger(server);

  server.auth.strategy("jwt_access", "cookie", {
    cookie: {
      name: "accessToken",
      password: process.env.COOKIE_SECRET!,
      isHttpOnly: true,
      isSecure: process.env.NODE_ENV === "production",
      isSameSite: "none",
      ttl: 15 * 60 * 1000,
      path: "/",
    },
    validate: validateAccess,
  });

  server.auth.scheme("custom-refresh", () => {
    return {
      authenticate: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
        const result = (await validateRefresh(request)) as any;
        if (!result.isValid) {
          throw new ApiError("Refresh token validation failed", 401);
        }
        return h.authenticated({ credentials: result.credentials });
      },
    };
  });

  server.auth.strategy("jwt_refresh", "custom-refresh");

  server.auth.default("jwt_access");

  server.events.on("response", function (req: Request) {
    console.log(
      `${req.info.remoteAddress}: ${req.method.toUpperCase()} ${req.path} --> ${
        (req.response as any).statusCode
      }`
    );
  });

  try {
    await connectDB();
    await server.register(routesPlugin);
    await server.start();
    console.log(`Server is running on ${server.info.uri}`);
    console.log(
      `Swagger is running on http://localhost:${process.env.PORT}/documentation`
    );
  } catch (error) {
    console.error("Unable to connect to the database or start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err: unknown) => {
  console.log(err);
  process.exit(1);
});

init();
