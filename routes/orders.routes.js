const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const Order = require('../models/Order.js');
const { requireAuth } = require('../middleware/auth.js');   // ✅ named import via destructuring

const router = express.Router();

const orderSchema = {
  [Segments.BODY]: Joi.object({
    orderNumber: Joi.string().alphanum().min(4).max(20).required(),
    items: Joi.array()
      .items(
        Joi.object({
          itemId: Joi.string().hex().length(24).required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
    total: Joi.number().positive().required(),
    currency: Joi.string().length(3).default('NGN'),
    status: Joi.string()
      .valid('pending', 'paid', 'shipped', 'cancelled')
      .default('pending'),
    customerEmail: Joi.string().email().required(),
  }),
};

// Public GETs
router.get('/', async (req, res, next) => {
  try {
    res.json(await Order.find());
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (e) {
    next(e);
  }
});

// Protected create
router.post('/', requireAuth, celebrate(orderSchema), async (req, res, next) => {
  try {
    const doc = await Order.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

// Protected update
router.put('/:id', requireAuth, celebrate(orderSchema), async (req, res, next) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// Protected delete
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;   // ✅ CommonJS export
