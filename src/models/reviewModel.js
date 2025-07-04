/**
 * @file reviewModel.js
 * @description This file defines the Model for product reviews.
 */


const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Reviews = sequelize.define("Reviews", {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
    defaultValue: 5,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      max: 500,
    },
  },
}, {
  timestamps: true,
  tableName: 'Reviews',
});

module.exports = Reviews;