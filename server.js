require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connectDB = require('./config/connect'); // must match filename exactly
const apiRoutes = require('./routes/index');   // /api routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","PATCH","DELETE"]
}));

// Routes
app.use("/", apiRoutes); // /api/hello

// Passport Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google OAuth routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    req.session.user = req.user;
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

// Root route
app.get("/", (req, res) => {
  res.send(req.session.user
    ? `Logged in as ${req.session.user.displayName}`
    : "Not logged in");
});

// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
  });
