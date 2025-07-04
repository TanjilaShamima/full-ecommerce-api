/**
 * @file reviewSchema.js
 * @description This file defines the schema for product reviews.
 */

const Joi = require("joi");

const reviewSchema = Joi.object({
  productId: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).default(5),
  comment: Joi.string().max(500).optional(),
});

module.exports = reviewSchema;
