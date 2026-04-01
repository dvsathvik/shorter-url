const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import our API routes and the MongoDB Model
const urlRoutes = require('./routes/urlRoutes');
const Url = require('./models/Url');

// Initialize the Express application
const app = express();

// Middleware: Enable Cross-Origin Resource Sharing (CORS) so our React Frontend can safely request our Backend
app.use(cors());

// Middleware: Parse incoming JSON request bodies (essential for accepting our POST form data)
app.use(express.json());

// Set up the API routes under the '/api/url' prefix
// (e.g., our shorten route becomes: POST domain.com/api/url/shorten)
app.use('/api/url', urlRoutes);

// --- THE CORE REDIRECT ENDPOINT ---
// We place this at the root ('/') so our short links look as short as possible!
// e.g. https://my-shortener.com/x7Bd9Q
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Search the database for the provided shortCode in either the 'shortUrl' or 'customAlias' field
    const urlDoc = await Url.findOne({
      $or: [{ shortUrl: shortCode }, { customAlias: shortCode }]
    });

    // If no document is found, it's an invalid link
    if (!urlDoc) {
      return res.status(404).send('URL not found or invalid short code.');
    }

    // Check if the link has an expiration date AND if that date has already passed
    if (urlDoc.expiresAt && urlDoc.expiresAt < new Date()) {
      return res.status(410).send('This link has expired.');
    }

    // If the link is entirely valid, increase the click count by 1 in the background.
    // Notice we DO NOT 'await' this upate! We update it asynchronously because we 
    // do not want to force the end-user to wait for the database update before redirecting.
    Url.updateOne(
      { _id: urlDoc._id },
      { $inc: { clickCount: 1 } }
    ).exec();

    // Finally, dynamically redirect the browser to the original long URL!
    return res.redirect(urlDoc.originalUrl);

  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).send('Server Error while trying to redirect.');
  }
});

// Define the port our server will run on (defaulting to 5000 if no Env var is set)
const PORT = process.env.PORT || 5000;

// Connect to the MongoDB Atlas database 
// IMPORTANT: We skip starting the server if we don't have a DB string!
if (!process.env.MONGODB_URI) {
  console.error("❌ CRITICAL ERROR: MONGODB_URI is not defined in the environment variables (.env). Please provide your connection string.");
} else {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Database');
    
    // Start listening for incoming requests once the database connects
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err);
  });
}
