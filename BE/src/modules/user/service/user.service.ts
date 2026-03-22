import { db } from "../../../config/db.js";
import { withTransaction } from "../../../common/utils/transaction.js";

export const getAllUsersService = async (userId: number) => {
  try {
    const users = await withTransaction(async (transaction) => {
      return db.User.findAll({
        attributes: { exclude: ["password"] },
        where: {
          id: {
            [db.Sequelize.Op.ne]: userId,
          },
        },
        transaction,
      });
    });
    if (!users) {
      return {
        statusCode: 404,
        message: "Users not found",
      };
    }
    return {
      statusCode: 200,
      message: "Users fetched successfully",
      data: users,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const getSingleUserService = async (
  id: number | string,
  userId: number
) => {
  try {
    const currId = id === "null" ? userId : id;
    const user = await withTransaction(async (transaction) => {
      return db.User.findOne({
        where: { id: currId },
        attributes: { exclude: ["password"] },
        transaction,
      });
    });
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }
    return {
      statusCode: 200,
      message: "User fetched successfully",
      data: user,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const updateDetailsService = async (
  id: number,
  data: { name: string }
) => {
  // console.log(data)
  try {
    return await withTransaction(async (transaction) => {
      const existedUser = await db.User.findOne({ where: { id }, transaction });
      if (!existedUser) {
        return {
          statusCode: 404,
          message: "User not found",
        };
      }
      await db.User.update(data, { where: { id }, transaction });
      const finalRes = await db.User.findOne({ where: { id }, transaction });
      return {
        statusCode: 200,
        message: "User updated successfully",
        data: finalRes,
      };
    });
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const toggleActiveService = async (id: number) => {
  try {
    return await withTransaction(async (transaction) => {
      const existedUser = await db.User.findOne({ where: { id }, transaction });
      if (!existedUser) {
        return {
          statusCode: 404,
          message: "User not found",
        };
      }
      await db.User.update(
        { isActive: !existedUser.isActive },
        { where: { id }, transaction }
      );
      const finalRes = await db.User.findOne({ where: { id }, transaction });
      return {
        statusCode: 200,
        message: "User updated successfully",
        data: finalRes,
      };
    });
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const deleteUserService = async (id: number) => {
  try {
    return await withTransaction(async (transaction) => {
      const user = await db.User.findOne({ where: { id }, transaction });
      if (!user) {
        return {
          statusCode: 404,
          message: "User not found",
        };
      }
      await db.User.destroy({ where: { id }, transaction });
      return {
        statusCode: 200,
        message: "User deleted successfully",
        data: { id: id },
      };
    });
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};
