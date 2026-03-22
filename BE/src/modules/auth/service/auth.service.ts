import { ResponseToolkit } from "@hapi/hapi";
import {
  LoginPayload,
  ResetPasswordPayload,
  signupPayload,
} from "../../../common/interfaces/User.interface.js";
import { db } from "../../../config/db.js";
import { queueEmail } from "./emailQueue.service.js";
import { JWTUtil } from "../../../common/utils/JWTUtils.js";
import { CryptoUtil } from "../../../common/utils/Crypto.js";
import { withTransaction } from "../../../common/utils/transaction.js";

const ORIGIN =
  (process.env.NODE_ENV === "production"
    ? process.env.PROD_ORIGIN
    : process.env.DEV_ORIGIN) ?? "http://localhost:3000";

// Send invite email (disabled)
const sendInviteEmail = async (user: any) => {
  // Emailing is disabled for now. Keep placeholder for future.
  console.log(`[email disabled] invite would be sent to: ${user?.email}`);
  return { success: true };
};

// Send OTP email (disabled)
const sendOTPEmail = async (email: string, otp: string) => {
  console.log(`[email disabled] OTP for ${email}: ${otp}`);
  return { success: true };
};

export const signupService = async ({
  name,
  email,
  password,
  user_type,
}: signupPayload) => {
  try {
    return await withTransaction(async (transaction) => {
      const existingUser = await db.User.findOne({
        where: { email },
        transaction,
      });
      if (existingUser) {
        return {
          statusCode: 409,
          message: "User already exists",
          data: null,
        };
      }

      const username = `user_${Math.floor(Math.random() * 1000000)}`;

      if (!user_type) {
        user_type = "admin";
      }

      const hashedPassword = CryptoUtil.hashPassword(password, "10");

      console.log(password, hashedPassword);

      const newUser = await db.User.create(
        {
          name,
          email,
          username,
          password: hashedPassword,
          isActive: true,
          user_type,
          is_reset_password: false,
          isOtpVerified: false,
        },
        { transaction }
      );

      if (!newUser) {
        return {
          statusCode: 400,
          message: "User registration failed",
          data: null,
        };
      }

      // sendInviteEmail(newUser).catch((err) => {
      //   console.error(`Failed to send invite email to ${newUser.email}:`, err);
      // });

      console.log(newUser);

      return {
        statusCode: 200,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          user_type: newUser.user_type,
        },
      };
    });
  } catch (error: any) {
    // console.error(error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      data: null,
    };
  }
};

export const loginService = async (
  { emailOrUsername, password }: LoginPayload,
  h: ResponseToolkit
) => {
  try {
    const result = await withTransaction(async (transaction) => {
      const isExistUser = await db.User.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { email: emailOrUsername },
            { username: emailOrUsername },
          ],
        },
        transaction,
      });
      if (!isExistUser) {
        return {
          statusCode: 400,
          message: "User not found",
          data: null,
        };
      }

      if (!isExistUser.isActive) {
        return {
          statusCode: 400,
          message: "User is inactive",
          data: null,
        };
      }

      const hashedInputPassword = CryptoUtil.hashPassword(password, "10");

      const isPasswordMatch = hashedInputPassword === isExistUser.password;

      if (!isPasswordMatch) {
        return {
          statusCode: 400,
          message: "Invalid password",
          data: null,
        };
      }

      const accessToken = JWTUtil.generateAccessToken(
        isExistUser.id,
        isExistUser.user_type
      );
      const refreshToken = JWTUtil.generateRefreshToken(
        isExistUser.id,
        isExistUser.user_type
      );

      await db.RefreshToken.create(
        {
          token: refreshToken,
          userId: isExistUser.id,
        },
        { transaction }
      );

      return {
        statusCode: 200,
        message: "User logged in successfully",
        accessToken,
        refreshToken,
        user: {
          id: isExistUser.id,
          name: isExistUser.name,
          email: isExistUser.email,
          role: isExistUser.user_type,
          username: isExistUser.username,
          user_type: isExistUser.user_type,
          isActive: isExistUser.isActive,
          isOtpVerified: isExistUser.isOtpVerified,
        },
      };
    });

    if (result.statusCode !== 200) {
      return result;
    }

    h.state("accessToken", result.accessToken, {
      path: "/",
      isHttpOnly: true,
      isSecure: process.env.NODE_ENV === "production",
      isSameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      ttl: 1 * 24 * 60 * 60 * 1000,
    });
    h.state("refreshToken", result.refreshToken, {
      path: "/",
      isHttpOnly: true,
      isSecure: process.env.NODE_ENV === "production",
      isSameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      ttl: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      statusCode: result.statusCode,
      message: result.message,
      user: result.user,
      data: null,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

export const otpSendService = async (email: string) => {
  // OTP send endpoint disabled for now.
  return {
    statusCode: 400,
    message: "OTP feature is disabled",
    data: null,
  };
};

export const otpCheckService = async (
  email: string,
  otp: string,
  h: ResponseToolkit
) => {
  // OTP verification disabled
  return {
    statusCode: 400,
    message: "OTP verification is disabled",
    data: null,
  };
};

export const refreshService = async (
  refreshToken: string,
  h: ResponseToolkit
) => {
  try {
    if (!refreshToken) {
      return {
        statusCode: 401,
        message: "Refresh token not found",
        data: null,
      };
    }

    const result = await withTransaction(async (transaction) => {
      // Validate refreshToken in the database
      const tokenRecord = await db.RefreshToken.findOne({
        where: { token: refreshToken },
        include: [{ model: db.User, as: "user" }],
        transaction,
      });

      if (!tokenRecord || !tokenRecord.user) {
        return {
          statusCode: 401,
          message: "Invalid or expired refresh token",
          data: null,
        };
      }

      // Verify user is active
      if (!tokenRecord.user.isActive) {
        return {
          statusCode: 403,
          message: "User is inactive",
          data: null,
        };
      }

      // Generate new tokens
      const newAccessToken = JWTUtil.generateAccessToken(
        tokenRecord.user.id,
        tokenRecord.user.user_type
      );
      const newRefreshToken = JWTUtil.generateRefreshToken(
        tokenRecord.user.id,
        tokenRecord.user.user_type
      );

      await db.RefreshToken.update(
        { token: newRefreshToken },
        { where: { token: refreshToken }, transaction }
      );

      return {
        statusCode: 200,
        message: "Tokens refreshed successfully",
        newAccessToken,
        newRefreshToken,
        data: {},
      };
    });

    if (result.statusCode !== 200) {
      return result;
    }

    // Set new HTTP-only cookies
    h.state("accessToken", result.newAccessToken, {
      path: "/",
      isHttpOnly: true,
      isSecure: process.env.NODE_ENV === "production",
      isSameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      ttl: 1 * 24 * 60 * 60 * 1000,
    });
    h.state("refreshToken", result.newRefreshToken, {
      path: "/",
      isHttpOnly: true,
      isSecure: process.env.NODE_ENV === "production",
      isSameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      statusCode: 200,
      message: "Tokens refreshed successfully",
      data: {},
    };
  } catch (err: any) {
    console.log(err);
    return {
      statusCode: 500,
      message: "Internal server error",
      data: null,
    };
  }
};

export const resetPasswordService = async ({
  emailOrUsername,
  tempPassword,
  newPassword,
}: ResetPasswordPayload) => {
  try {
    return await withTransaction(async (transaction) => {
      const isExistUser = await db.User.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { email: emailOrUsername },
            { username: emailOrUsername },
          ],
        },
        transaction,
      });

      if (!isExistUser) {
        return {
          statusCode: 400,
          message: "User not found",
          data: null,
        };
      }

      if (!isExistUser.isActive) {
        return {
          statusCode: 400,
          message: "User is inactive",
          data: null,
        };
      }

      // console.log(tempPassword);
      // console.log(isExistUser.password);
      const isPasswordMatch = tempPassword === isExistUser.password;

      if (!isPasswordMatch) {
        return {
          statusCode: 400,
          message: "Invalid password",
          data: null,
        };
      }

      await db.User.update(
        { password: newPassword, is_reset_password: true },
        { where: { id: isExistUser.id }, transaction }
      );

      return {
        statusCode: 200,
        message: "Password reset successfully",
        user: {
          id: isExistUser.id,
          name: isExistUser.name,
          email: isExistUser.email,
          username: isExistUser.username,
          user_type: isExistUser.user_type,
          isActive: isExistUser.isActive,
        },
      };
    });
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
      data: null,
    };
  }
};

export const myService = async (userId: string) => {
  try {
    return await withTransaction(async (transaction) => {
      const user = await db.User.findByPk(userId, { transaction });
      if (!user) {
        return {
          statusCode: 404,
          message: "User not found",
          data: null,
        };
      }
      // OTP verification requirement removed for now.

      return {
        statusCode: 200,
        message: "User fetched successfully",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.user_type,
            username: user.username,
            user_type: user.user_type,
            isActive: user.isActive,
            isOtpVerified: user.isOtpVerified,
          },
        },
      };
    });
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
      data: null,
    };
  }
};

export const logoutService = async (userId: string, h: ResponseToolkit) => {
  try {
    const result = await withTransaction(async (transaction) => {
      const user = await db.User.findByPk(userId, { transaction });
      if (!user) {
        return {
          statusCode: 404,
          message: "User not found",
          data: null,
        };
      }

      // Revoke all existing access tokens issued before now.
      await db.User.update(
        { lastLogoutAt: new Date() },
        { where: { id: userId }, transaction }
      );

      await db.RefreshToken.destroy({
        where: {
          userId,
        },
        transaction,
      });

      return {
        statusCode: 200,
        message: "User logged out successfully",
        data: null,
      };
    });

    if (result.statusCode !== 200) {
      return result;
    }

    h.unstate("accessToken", {
      path: "/",
    });
    h.unstate("refreshToken", {
      path: "/",
    });
    return {
      statusCode: result.statusCode,
      message: result.message,
      data: {},
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
      data: null,
    };
  }
};
