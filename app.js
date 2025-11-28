const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const passport = require('./auth/passport');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const { errors } = require('celebrate');

const app = express();

// Core
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.set('trust proxy', 1);

// Mongo
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error', err));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true in HTTPS with proper proxy
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// OAuth endpoints
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => res.redirect('/auth/success')
);
app.get('/auth/success', (req, res) => res.json({ message: 'Logged in', user: req.user }));
app.get('/auth/failure', (req, res) => res.status(401).json({ error: 'OAuth failure' }));
app.get('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
  });
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// API routes
app.use('/api', routes);

// Celebrate/Joi validation errors
app.use(errors());

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || (err.name === 'ValidationError' ? 400 : 500);
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
