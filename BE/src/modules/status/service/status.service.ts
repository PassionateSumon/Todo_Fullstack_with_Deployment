import { db } from "config/db";

export const createstatusService = async ({ name }: { name: string }) => {
  try {
    const existed = await db.Status.findOne({ where: { name } });
    // console.log("existed: --> ", existed);
    if (existed) {
      return {
        statusCode: 409,
        message: "Status already exists",
      };
    }

    const result = await db.Status.create({ name });
    if (!result) {
      return {
        statusCode: 400,
        message: "Status creation failed",
      };
    }
    // console.log(result)
    return {
      statusCode: 200,
      message: "Status created successfully",
      data: result,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
};

export const getAllStatusService = async () => {
  try {
    const result = await db.Status.findAll({ attributes: ["id", "name"] });
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
    const result = await db.Status.findOne(
      { where: { id } },
      { attributes: ["id", "name"] }
    );
    if (!result) {
      return {
        statusCode: 404,
        message: "Status not found",
      };
    }
    await db.Status.update({ name }, { where: { id } });
    const finalRes = await db.Status.findOne({ where: { id } });
    return {
      statusCode: 200,
      message: "Status updated successfully",
      data: finalRes,
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};

export const deleteStatusService = async ({id}: { id: number }) => {
  try {
    const result = await db.Status.findOne({ where: { id } });
    if (!result) {
      return {
        statusCode: 404,
        message: "Status not found",
      };
    }
    await db.Status.destroy({ where: { id } });
    return {
      statusCode: 200,
      message: "Status deleted successfully",
      data: {id: id},
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.message || "Internal server error",
    };
  }
};