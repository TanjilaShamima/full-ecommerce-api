/**
 * @file orderSchema.js
 * @description This file defines the schema for order data validation using Joi.
 */

const Joi = require("joi");

const orderSchema = Joi.object({
  userId: Joi.integer().required(),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.integer().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().precision(2).required(),
      })
    )
    .required(),
  totalPrice: Joi.number().precision(2).required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  status: Joi.string()
    .valid("pending", "shipped", "delivered", "cancelled")
    .default("pending"),
  paymentMethod: Joi.string()
    .valid("credit_card", "online_banking", "cash_on_delivery")
    .default("cash_on_delivery"),
  paymentStatus: Joi.string().valid("paid", "unpaid").default("unpaid"),
  createdAt: Joi.date().default(() => new Date(), "time of creation"),
  updatedAt: Joi.date().default(() => new Date(), "time of update"),
});

module.exports = orderSchema;
