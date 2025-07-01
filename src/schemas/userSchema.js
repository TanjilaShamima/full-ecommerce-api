/*
User Schema
*/

const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(8).max(100).required(),
  email: Joi.string().email().required(),
  fullName: Joi.string().min(1).max(50).optional(),
  dateOfBirth: Joi.date().optional(),
  status: Joi.boolean().default(true),
  gender: Joi.string().valid("male", "female", "other").optional(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  images: Joi.object().optional().allow(null),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    )
    .required(),
  role: Joi.string()
    .valid("customer", "merchant", "artisan", "admin", "super_admin")
    .default("customer"),
  googleId: Joi.string().optional(),
  createdAt: Joi.date().default(() => new Date(), "time of creation"),
  updatedAt: Joi.date().default(() => new Date(), "time of update"),
  verifiedAt: Joi.date().optional(),
});

module.exports = userSchema;
