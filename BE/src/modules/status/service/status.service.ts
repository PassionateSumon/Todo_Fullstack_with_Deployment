import { db } from "../../../config/db.js";
import { withTransaction } from "../../../common/utils/transaction.js";

export const createstatusService = async ({ name }: { name: string }) => {
  try {
    return await withTransaction(async (transaction) => {
      const existed = await db.Status.findOne({ where: { name }, transaction });
      if (existed) {
        return {
          statusCode: 409,
          message: "Status already exists",
        };
      }

      const result = await db.Status.create({ name }, { transaction });
      if (!result) {
        return {
          statusCode: 400,
          message: "Status creation failed",
        };
      }
      return {
        statusCode: 200,
        message: "Status created successfully",
        data: result,
      };
    });
  } catch (err: any) {
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
};

export const getAllStatusService = async () => {
  try {
    const result = await withTransaction(async (transaction) => {
      return db.Status.findAll({ attributes: ["id", "name"], transaction });
    });
    return {
      statusCode: 200,
      message: "Status fetched successfully",
      data: result,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
};

export const updateStatusService = async ({
  id,
  name,
}: {
  id: number;
  name: string;
}) => {
  try {
    return await withTransaction(async (transaction) => {
      const result = await db.Status.findOne({
        where: { id },
        attributes: ["id", "name"],
        transaction,
      });
      if (!result) {
        return {
          statusCode: 404,
          message: "Status not found",
        };
      }
      await db.Status.update({ name }, { where: { id }, transaction });
      const finalRes = await db.Status.findOne({ where: { id }, transaction });
      return {
        statusCode: 200,
        message: "Status updated successfully",
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

export const deleteStatusService = async ({id}: { id: number }) => {
  try {
    return await withTransaction(async (transaction) => {
      const result = await db.Status.findOne({ where: { id }, transaction });
      if (!result) {
        return {
          statusCode: 404,
          message: "Status not found",
        };
      }

      await db.Task.destroy({ where: { status_id: id }, transaction });
      await db.Status.destroy({ where: { id }, transaction });

      return {
        statusCode: 200,
        message: "Status deleted successfully",
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