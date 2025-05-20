export default (sequelize: any, DataType: any) => {
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataType.STRING(350),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataType.DATE,
        allowNull: true,
        validate: {
          isFuture(value: Date) {
            if (value <= new Date()) {
              throw new Error("Expiration date must be in the future.");
            }
          },
        },
      },
      userId: {
        type: DataType.INTEGER,
        allowNull: false,
      },
    },
    { tableName: "RefreshToken", timestamps: true }
  );

  RefreshToken.associate = (models: any) => {
    RefreshToken.belongsTo(models.User, { foreignKey: "userId", as : "user" });
  };

  return RefreshToken;
};
