const Joi = require('joi');

export const productCreateSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  sku: Joi.string().alphanum().min(3).max(30).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().min(2).max(50).required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().max(500).allow(''),
  tags: Joi.array().items(Joi.string()).default([]),
  isActive: Joi.boolean().default(true)
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(120),
  sku: Joi.string().alphanum().min(3).max(30),
  price: Joi.number().min(0),
  category: Joi.string().min(2).max(50),
  stock: Joi.number().integer().min(0),
  description: Joi.string().max(500).allow(''),
  tags: Joi.array().items(Joi.string()),
  isActive: Joi.boolean()
}).min(1);
