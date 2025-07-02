/**
 * @file storySchema.js
 * @description This file defines the schema for story data validation using Joi.
 */

const Joi = require("joi");

const storySchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).max(5000).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.object({})).optional(),
});

module.exports = storySchema;