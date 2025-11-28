const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true }, // e.g., "google"
    providerId: { type: String, required: true }, // Google profile ID
    email: { type: String, lowercase: true },
    name: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;  // ✅ ES module export
