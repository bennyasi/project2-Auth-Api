const express = require('express');
const { validateBody } = require('../middleware/validate.js');
const { requireAuth, requireRole } = require('../middleware/auth.js');
const { productCreateSchema, productUpdateSchema } = require('../validation/product.schema.js');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products.controller.js');

const router = express.Router();

// Public: anyone can list or get products
router.get('/', listProducts);
router.get('/:id', getProduct);

// Protected: only authenticated users with admin role can create/update/delete
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  validateBody(productCreateSchema),
  createProduct
);

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  validateBody(productUpdateSchema),
  updateProduct
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  deleteProduct
);

module.exports = router;   // ✅ CommonJS export
