/*
 * validateSchema.js
 * Middleware to validate request body against a Joi schema.
 */

const createError = require("http-errors");
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      throw createError(
        400,
        `Validation failed- ${error.details
          .map((detail) => detail.message)
          .join(", ")}`
      );
    }

    next();
  };
};

module.exports = validateSchema;
