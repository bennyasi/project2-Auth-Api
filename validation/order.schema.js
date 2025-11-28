const Joi = require('joi');

const addressSchema = Joi.object({
  line1: Joi.string().min(3).max(120).required(),
  line2: Joi.string().max(120).allow(''),
  city: Joi.string().min(2).max(60).required(),
  state: Joi.string().max(60).allow(''),
  postalCode: Joi.string().min(3).max(20).required(),
  country: Joi.string().min(2).max(60).required()
});

const itemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().min(0).required()
});

export const orderCreateSchema = Joi.object({
  items: Joi.array().items(itemSchema).min(1).required(),
  shippingAddress: addressSchema.required()
});

export const orderUpdateSchema = Joi.object({
  items: Joi.array().items(itemSchema).min(1),
  shippingAddress: addressSchema,
  status: Joi.string().valid('pending', 'paid', 'shipped', 'completed', 'cancelled')
}).min(1);
