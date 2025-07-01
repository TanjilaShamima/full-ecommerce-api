const Joi = require("joi");

const craftTypeSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(255).optional(),
});

module.exports = craftTypeSchema;
