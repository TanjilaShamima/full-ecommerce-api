/**
 * Database connection module
 */

const sequelize = require("./sequelize");
const createError = require("http-errors");
const logger = require("../utils/logger");

const connectToDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Sync models with the database
    logger.info("Database connection established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw createError(error);
  }
};

module.exports = connectToDatabase;
