const express = require('express');
const router = express.Router();

// Import our controller logic functions
const { shortenUrl, getAnalytics } = require('../controllers/urlController');

// Define the route to create a new short URL
// When our React app sends a POST request to '/api/url/shorten', the 'shortenUrl' function runs
router.post('/shorten', shortenUrl);

// Define the route to fetch analytics data for a specific short link
// Example usage: GET '/api/url/analytics/summer-sale'
router.get('/analytics/:shortCode', getAnalytics);

// Export the router so the main server.js file can use it
module.exports = router;
