const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    req.session.user = req.user; // store user in session
    res.send(`
      <html>
        <body style="font-family: sans-serif;">
          <h2>Login successful</h2>
          <p>Welcome, ${req.user.displayName}</p>
          <p><a href="/">Go Home</a></p>
        </body>
      </html>
    `);
  }
);

// Failure route
router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

module.exports = router;
