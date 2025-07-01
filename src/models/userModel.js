/**
 * @file userModel.js
 * @description This file defines the model for user data validation using Joi.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const bcrypt = require("bcrypt");
const Address = require("./addressModel");
const ArtisanProfile = require("./artisanProfileModel");
const Role = require("./roleModel");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSONB, // Using JSONB to allow flexible structure for images
      allowNull: true,
      defaultValue: null, // Allow null or empty images
    },
    googleId: {
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
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Associations
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(ArtisanProfile, { foreignKey: "userId", as: "artisanProfile" });
ArtisanProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(Role, { foreignKey: "userId", as: "role" });
Role.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = User;
