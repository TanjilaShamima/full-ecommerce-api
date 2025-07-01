/**
 * @file artisanProfileSchema.js
 * @description This file defines the schema for artisan profile data validation using Joi.
 */

const Joi = require("joi");

const artisanProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  tagLine: Joi.string().max(100).optional(),
  district: Joi.string().min(2).max(50).required(),
  city: Joi.string().min(2).max(50).required(),
  productType: Joi.string().min(3).max(50).required(),
  socialMedia: Joi.string().uri().optional(),
  about: Joi.string().max(500).optional(),
  images: Joi.array().items(Joi.object({})).optional(),
});

module.exports = artisanProfileSchema;
