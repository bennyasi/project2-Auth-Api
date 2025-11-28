const express = require('express');
const bcrypt = require('bcryptjs');                          // use bcryptjs (matches your package.json)
const { celebrate, Joi, Segments } = require('celebrate');   // CommonJS require
cons                // match lowercase filename

const router = express.Router();

// Signup route
router.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().min(2).max(100).optional()
    })
  }),
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const exists = await User.findOne({ email, provider: 'local' });
      if (exists) return res.status(409).json({ error: 'Account exists' });

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({
        provider: 'local',
        providerId: email,
        email,
        name,
        passwordHash
      });

      res.status(201).json({ id: user.id, email: user.email });
    } catch (e) {
      next(e);
    }
  }
);

// Login route
router.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    })
  }),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, provider: 'local' });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      req.login(user, (err) => {
        if (err) return next(err);
        res.json({
          message: 'Logged in',
          user: { id: user.id, email: user.email }
        });
      });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;   // ✅ CommonJS export
