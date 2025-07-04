/**
 * @file src/models/cartModel.js
 * @description This file defines the model for cart data.
 */


const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./userModel");

const Cart = sequelize.define("Cart", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  products: {
    type: DataTypes.JSONB, // Using JSONB to allow flexible structure for products
    allowNull: false,
    defaultValue: [], // Default to an empty array if no products are added
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

User.hasOne(Cart, {
  foreignKey: "userId",
  as: "cart",
});
Cart.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = Cart;
