import type { Transaction } from "sequelize";
import { db } from "../../config/db.js";

export const withTransaction = async <T>(
  callback: (transaction: Transaction) => Promise<T>
): Promise<T> => {
  return db.sequelize.transaction(async (transaction: Transaction) => {
    return callback(transaction);
  });
};
