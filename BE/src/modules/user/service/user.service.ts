import { db } from "config/db";

export const getAllUsersService = async (userId: number) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password"] },
      where: {
        id: {
          [db.Sequelize.Op.ne]: userId,
        },
      },
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
    const user = await db.User.findOne({
      where: { id: currId },
      attributes: { exclude: ["password"] },
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
    const existedUser = await db.User.findOne({ where: { id } });
    if (!existedUser) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }
    await db.User.update(data, { where: { id } });
    const finalRes = await db.User.findOne({ where: { id } });
    return {
      statusCode: 200,
      message: "User updated successfully",
      data: finalRes,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const toggleActiveService = async (id: number) => {
  try {
    const existedUser = await db.User.findOne({ where: { id } });
    // console.log(existedUser)
    if (!existedUser) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }
    await db.User.update(
      { isActive: !existedUser.isActive },
      { where: { id } }
    );
    const finalRes = await db.User.findOne({ where: { id } });
    return {
      statusCode: 200,
      message: "User updated successfully",
      data: finalRes,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const deleteUserService = async (id: number) => {
  try {
    const user = await db.User.findOne({ where: { id } });
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }
    await db.User.destroy({ where: { id } });
    return {
      statusCode: 200,
      message: "User deleted successfully",
      data: { id: id },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};
