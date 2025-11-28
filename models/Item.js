const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
