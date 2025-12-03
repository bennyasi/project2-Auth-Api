console.log("STEP 1: Loading environment...");
require("dotenv").config();

console.log("STEP 2: Importing modules...");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

console.log("STEP 3: Creating app...");
const app = express();

console.log("STEP 4: Applying middleware...");
app.use(cors());
app.use(express.json());

console.log("STEP 5: Configuring session...");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  })
);

console.log("STEP 6: Initializing passport...");
app.use(passport.initialize());
app.use(passport.session());

// Temporary simple serialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => done(null, id));

console.log("STEP 7: Setting up Google Strategy...");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

console.log("STEP 8: Loading swagger.json...");
let swaggerDocs = {};
try {
  const swaggerPath = path.join(__dirname, "swagger.json");
  swaggerDocs = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
  console.log("Swagger loaded successfully");
} catch (err) {
  console.error("Error loading Swagger file:", err.message);
}

console.log("STEP 9: Registering swagger route...");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log("STEP 10: Registering routes...");
app.get("/", (req, res) => res.send("Server is alive!"));
app.get("/api/hello", (req, res) => res.json({ msg: "Hello" }));

console.log("STEP 11: Connecting MongoDB...");
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

console.log("STEP 12: Starting server...");
async function start() {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();

