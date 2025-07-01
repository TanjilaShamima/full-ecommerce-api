/*
User Schema
*/

const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(3).max(20).optional(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"))
    .required(),
  email: Joi.string().email().required(),
  fullName: Joi.string().min(1).max(50).required(),
  dateOfBirth: Joi.date().optional(),
  status: Joi.string()
    .valid("pending", "active", "deactivate", "baned", "deleted")
    .default(Joi.ref('role', {
      adjust: (role) => role === 'artisan' ? 'pending' : 'active',
    })),
  gender: Joi.string().valid("male", "female", "other").optional(),
  mobile: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  images: Joi.object().optional().allow(null),
  role: Joi.string()
    .valid("super_admin", "admin", "customer", "artisan", "merchant")
    .default("customer"),
  googleId: Joi.string().optional(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
  verifiedAt: Joi.date().optional(),
});

module.exports = userSchema;
