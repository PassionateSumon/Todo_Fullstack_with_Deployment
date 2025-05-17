export default (sequelize: any, DataType: any) => {
  const Status = sequelize.define(
    "Status",
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataType.STRING,
        allowNull: false,
      },
    },
    { tableName: "Status", timestamps: true }
  );
  Status.associate = (models: any) => {
    Status.hasMany(models.Task, {
      foreignKey: "status_id",
      as: "tasks",
    });
  };
  return Status;
};
