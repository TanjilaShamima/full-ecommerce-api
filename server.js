const express = require("express");
const app = express();
const createError = require("http-errors");
const swaggerUi = require("swagger-ui-express");

// internal imports
const indexRouter = require("./src/routers/indexRouter");
const logger = require("./src/utils/logger");
const appConfig = require("./src/config/constant");
const swaggerDocs = require("./src/config/swagger");
const connectToDatabase = require("./src/config/dbConnect");

// Middleware for parsing JSON requests
app.use(express.json());
// Middleware for parsing URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// router setup
app.use("/api/v1", indexRouter);

// swagger setup
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: { deepLinking: false },
  })
);

// catch 404 or not found route and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "This route does not exist"));
});

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  logger.error(`Error: ${message}, Status Code: ${statusCode}`);
  res.status(statusCode).json({
    status: "error",
    success: false,
    statusCode: statusCode,
    message: message,
  });
});

// app listen, DB connection, and server start
app.listen(appConfig.port, async () => {
  logger.info(`Server is running on ${appConfig.appDomain}`);
  logger.info(`API Documentation: ${appConfig.appDomain}/api/docs`);
  await connectToDatabase();
});
