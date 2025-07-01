const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Role = sequelize.define("Role", {
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permissions: {
    type: DataTypes.ENUM("super_admin", "admin", "customer", "artisan", "merchant"),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Role;
