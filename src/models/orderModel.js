/**
 * @file orderModel.js
 * @description This file defines the model for order data.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Orders = sequelize.define(
  "Orders",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSONB, // Using JSONB to allow flexible structure for products
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "unpaid",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = Orders;
