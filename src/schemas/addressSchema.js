/**
 * @file addressSchema.js
 * @description This file defines the schema for address data validation using Joi.
 */

const Joi = require("joi");

const addressSchema = Joi.object({
  addressLine1: Joi.string().min(3).max(100).required(),
  addressLine2: Joi.string().min(3).max(100).optional(),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).required(),
  postalCode: Joi.string().pattern(/^[0-9]{5,10}$/).required(),
  country: Joi.string().min(2).max(50).required(),
});

module.exports = addressSchema;
