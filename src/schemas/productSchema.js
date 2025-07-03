/**
 * @file src/models/productSchema.js
 * @description This file defines the schema for product data validation using Joi.
 */


const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(5000).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().min(3).max(50).required(),
  stock: Joi.number().integer().min(0).required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  material: Joi.string().min(3).max(50).optional(),
  dimensions: Joi.object({
    length: Joi.string().optional(),
    width: Joi.string().optional(),
    height: Joi.string().optional(),
  }).optional(),
  color: Joi.string().min(3).max(30).optional(),
  size: Joi.string().min(1).max(20).optional(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});

module.exports = productSchema;