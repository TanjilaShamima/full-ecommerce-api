const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const CraftType = sequelize.define("CraftType", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = CraftType;
