const mongoose = require('mongoose');

// Define the Schema for our URL shortener
const urlSchema = new mongoose.Schema({
  // The original, long URL the user wants to shorten
  originalUrl: {
    type: String,
    required: true,
  },
  // The generated short alias (e.g., "aB3x9zK")
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  // An optional custom alias provided by the user (e.g., "summer-sale")
  customAlias: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null/undefined values without throwing uniqueness errors
  },
  // The total number of times the short link has been clicked
  clickCount: {
    type: Number,
    required: true,
    default: 0,
  },
  // Optional date when the link expires and stops redirecting
  expiresAt: {
    type: Date,
    default: null, // Null means it never expires
  },
  // When the link was created
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create the model using the schema
const Url = mongoose.model('Url', urlSchema);

// Export the model so other files can use it
module.exports = Url;
