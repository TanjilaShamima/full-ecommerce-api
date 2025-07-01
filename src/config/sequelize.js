/*
Sequelize configuration for database connection
*/

const { Sequelize } = require("sequelize");
const appConfig = require("./constant");

const sequelize = new Sequelize(
  appConfig.db.dbName,
  appConfig.db.dbUser,
  appConfig.db.dbPassword,
  {
    host: appConfig.db.dbHost,
    port: appConfig.db.dbPort,
    dialect: "postgres",
    logging: false, // Disable logging; default: console.log
    pool: {
      max: 5, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000, // Maximum time, in milliseconds, that a connection can be idle before being released
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;
