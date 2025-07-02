/**
 * @file userModel.js
 * @description This file defines the model for user data validation using Joi.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const bcrypt = require("bcrypt");
const Address = require("./addressModel");
const ArtisanProfile = require("./artisanProfileModel");

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
      type: DataTypes.ENUM("pending", "active", "deactivate", "baned", "deleted"),
      allowNull: false,
      defaultValue: "active",
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
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
    role: {
      type: DataTypes.ENUM("super_admin", "admin", "customer", "artisan", "merchant"),
      allowNull: false,
      defaultValue: "customer",
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiresAt: {
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
        if (user.role === "artisan") {
          user.status = "pending";
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        if (user.changed("role") && user.role === "artisan") {
          user.status = "pending";
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

module.exports = User;
