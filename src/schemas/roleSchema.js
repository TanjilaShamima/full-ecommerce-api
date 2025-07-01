/**
 * @file roleSchema.js
 * @description This file defines the schema for role data validation using Joi.
 */

const Joi = require("joi");

const roleSchema = Joi.object({
  roleName: Joi.string().min(3).max(50).required(),
  permissions: Joi.string()
    .valid("super_admin", "admin", "customer", "artisan", "merchant")
    .required(),
  description: Joi.string().max(200).optional(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});
/**
 * @typedef {Object} Role
 * @property {string} roleName - The name of the role.
 * @property {Array<string>} permissions - The permissions associated with the role.
 * @property {string} [description] - A brief description of the role.
 * @property {Date} createdAt - The date and time when the role was created.
 * @property {Date} updatedAt - The date and time when the role was last updated.
 */
module.exports = roleSchema;
