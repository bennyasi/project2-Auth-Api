const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const Item = require('../models/Item');

const router = express.Router();

const itemSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(2).max(100).required(),
    sku: Joi.string().alphanum().min(4).max(20).required(),
    description: Joi.string().max(500).allow(''),
    price: Joi.number().positive().required(),
    currency: Joi.string().length(3).default('NGN'),
    inStock: Joi.boolean().default(true),
    tags: Joi.array().items(Joi.string()).default([])
  })
};

// Public GETs
router.get('/', async (req, res, next) => {
  try { res.json(await Item.find()); } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// Create item (no authRequired)
router.post('/',
  celebrate(itemSchema),
  async (req, res, next) => {
    try {
      const doc = await Item.create({ ...req.body });
      res.status(201).json(doc);
    } catch (e) { next(e); }
  }
);

// Update item (no authRequired)
router.put('/:id',
  celebrate(itemSchema),
  async (req, res, next) => {
    try {
      const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (e) { next(e); }
  }
);

// Delete item (no authRequired)
router.delete('/:id',
  async (req, res, next) => {
    try {
      const deleted = await Item.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch (e) { next(e); }
  }
);

module.exports = router;
