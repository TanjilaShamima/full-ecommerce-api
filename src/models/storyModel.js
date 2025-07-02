/**
 * @file src/models/storyModel.js
 * @description This file defines the model for story data validation using Joi.
 */


const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Story = sequelize.define("Story", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
});

module.exports = Story;
