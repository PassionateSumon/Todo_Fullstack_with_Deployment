import { Sequelize } from "sequelize";
import { DataType } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "../models/user.model";
import Task from "../models/task.model";
import Status from "../models/status.model";
import RefreshToken from "../models/refreshToken.model";
dotenv.config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env as any;

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: "localhost",
  port: 3307,
  dialect: "mysql",
  logging: false,
});

const db: any = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User(sequelize, DataType);
db.Task = Task(sequelize, DataType);
db.Status = Status(sequelize, DataType);
db.RefreshToken = RefreshToken(sequelize, DataType);

// Setup associations
Object.values(db).forEach((model: any) => {
  if (model?.associate) {
    model.associate(db);
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { db, connectDB };
