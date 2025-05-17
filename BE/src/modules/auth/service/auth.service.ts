import { ResponseToolkit } from "@hapi/hapi";
import { statusCodes } from "../../../common/constants/constants";
import {
  LoginPayload,
  ResetPasswordPayload,
  signupPayload,
} from "../../../common/interfaces/User.interface";
import { CryptoUtil } from "../../../common/utils/Crypto";
import { error } from "../../../common/utils/returnFunctions";
import { db } from "../../../config/db";
import { queueEmail } from "./emailQueue.service";
import { JWTUtil } from "common/utils/JWTUtils";

// send invite email
const sendInviteEmail = async (user: any, tempPassword: string) => {
  const resetUrl = `${process.env.DEV_ORIGIN}/auth/reset-password`;
  const emailContent = `
    Welcome to the Todo App!
    Username: ${user.username}
    Temporary Password: ${tempPassword}
    Reset password at: ${resetUrl}
  `;
  await queueEmail({
    to: user.email,
    subject: "Invitation to Join School",
    text: emailContent,
  });
};

export const signupService = async ({
  name,
  email,
  password,
  user_type,
}: signupPayload) => {
  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return {
        statusCode: 409,
        message: "User already exists",
      };
    }

    const hashedPassword = CryptoUtil.hashPassword(password, "10");
    const username = Math.floor(Math.random() * 1000000).toString();

    const newUser = await db.User.create({
      name,
      email,
      username,
      password: hashedPassword,
      isActive: true,
      user_type,
      is_reset_password: false,
    });

    if (!newUser) {
      return {
        statusCode: 400,
        message: "User registration failed",
      };
    }

    try {
      await sendInviteEmail(newUser, password);
    } catch (err: any) {
      return {
        statusCode: 500,
        message: "Failed to send invite email",
      };
    }

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
  } catch (error: any) {
    // console.error(error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
    };
  }
};

export const loginService = async (
  { emailOrUsername, password }: LoginPayload,
  h: ResponseToolkit
) => {
  try {
    const isExistUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });
    // console.log(isExistUser)
    if (!isExistUser) {
      return {
        statusCode: 400,
        message: "User not found",
      };
    }

    if (!isExistUser.isActive) {
      return {
        statusCode: 400,
        message: "User is inactive",
      };
    }

    const isPasswordMatch = CryptoUtil.verifyPassword(
      password,
      "10",
      isExistUser.password
    );

    if (!isPasswordMatch) {
      return {
        statusCode: 400,
        message: "Invalid password",
      };
    }
    if (!isExistUser.is_reset_password) {
      return {
        statusCode: 400,
        message: "Please reset your password",
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

    try {
      await db.RefreshToken.create({
        token: refreshToken,
        userId: isExistUser.id,
      });
      // console.log(res)
    } catch (err: any) {
      console.log(err);
      return {
        statusCode: 500,
        message: "Internal server error for creating refresh token",
      };
    }

    h.state("accessToken", accessToken, {
      path: "/",
      isHttpOnly: true,
      ttl: 1 * 24 * 60 * 60 * 1000, // 1 day
    });
    h.state("refreshToken", refreshToken, {
      path: "/",
      isHttpOnly: true,
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 day
    });

    return {
      statusCode: 200,
      message: "User logged in successfully",
      user: {
        id: isExistUser.id,
        name: isExistUser.name,
        email: isExistUser.email,
        username: isExistUser.username,
        user_type: isExistUser.user_type,
        isActive: isExistUser.isActive,
        accessToken,
        refreshToken,
      },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
};

export const resetPasswordService = async ({
  emailOrUsername,
  tempPassword,
  newPassword,
}: ResetPasswordPayload) => {
  try {
    const isExistUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      },
    });

    if (!isExistUser) {
      return {
        statusCode: 400,
        message: "User not found",
      };
    }

    if (!isExistUser.isActive) {
      return {
        statusCode: 400,
        message: "User is inactive",
      };
    }

    const isPasswordMatch = CryptoUtil.verifyPassword(
      tempPassword,
      "10",
      isExistUser.password
    );

    if (!isPasswordMatch) {
      return {
        statusCode: 400,
        message: "Invalid password",
      };
    }

    const hashedPassword = CryptoUtil.hashPassword(newPassword, "10");
    await db.User.update(
      { password: hashedPassword, is_reset_password: true },
      { where: { id: isExistUser.id } }
    );

    return {
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
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const logoutService = async (userId: string, h: ResponseToolkit) => {
  try {
    const deletedCount = await db.RefreshToken.destroy({
      where: {
        userId,
      },
    });
    if (deletedCount === 0) {
      return {
        statusCode: 400,
        message: "Refresh token not found",
      };
    }
    h.unstate("accessToken", {
      path: "/",
    });
    h.unstate("refreshToken", {
      path: "/",
    });
    return {
      message: "User logged out successfully",
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};
