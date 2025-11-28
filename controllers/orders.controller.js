import Order from '../models/Order.js';
import mongoose from 'mongoose';

export const listOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const total = req.body.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(req.user.id),
      items: req.body.items,
      shippingAddress: req.body.shippingAddress,
      total
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (update.items) {
      update.total = update.items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
    }
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
