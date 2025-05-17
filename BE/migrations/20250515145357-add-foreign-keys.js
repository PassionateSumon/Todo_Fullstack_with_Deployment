"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addConstraint("Task", {
    fields: ["user_id"],
    type: "foreign key",
    name: "fk_tasks_user", // custom constraint name
    references: {
      table: "User",
      field: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  await queryInterface.addConstraint("Task", {
    fields: ["status_id"],
    type: "foreign key",
    name: "fk_tasks_status", // custom constraint name
    references: {
      table: "Status",
      field: "id",
    },
    onUpdate: "CASCADE",
  });

  await queryInterface.addConstraint("RefreshToken", {
    fields: ["userId"],
    type: "foreign key",
    name: "fk_refresh_token_user",
    references: {
      table: "User",
      field: "id",
    },
    onDelete: "CASCADE",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeConstraint("Task", "fk_tasks_user");
  await queryInterface.removeConstraint("Task", "fk_tasks_status");
  await queryInterface.removeConstraint(
    "RefreshToken",
    "fk_refresh_token_user"
  );
}
