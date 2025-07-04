/**
 * @file src/models/cartSchema.js
 * @description This file defines the Schema for cart data validation using Joi.
 */

const Joi = require("joi");

const cartSchema = Joi.object({
  userId: Joi.string().integer(),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().precision(2).required(),
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().precision(2).required(),
//   status: Joi.string().valid("pending", "completed", "cancelled").default("pending"),
  createdAt: Joi.date().default(() => new Date(), "time of creation"),
  updatedAt: Joi.date().default(() => new Date(), "time of update"),
});

module.exports = cartSchema;