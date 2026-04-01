const { nanoid } = require('nanoid');
const Url = require('../models/Url');

// @route   POST /api/url/shorten
// @desc    Takes a long URL and generates a short code for it
const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresInDays } = req.body;

    // 1. Basic validation - Ensure they provided a URL
    if (!originalUrl) {
      return res.status(400).json({ error: 'Please provide a valid long URL' });
    }

    // 2. Check if the user wants a completely custom alias
    if (customAlias) {
      // Look up the database to see if this alias is already taken
      const existingAlias = await Url.findOne({ customAlias });
      if (existingAlias) {
        return res.status(400).json({ error: 'This custom alias is already in use. Please choose another one.' });
      }
    }

    // 3. Generate the Short Code (using nanoid if no custom alias was requested)
    // nanoid(7) creates a random 7-character string like "V1StGXR"
    const shortUrl = nanoid(7); 

    // 4. Handle Expiration logic (if the user requested an expiry date)
    let expiresAtDate = null;
    if (expiresInDays && !isNaN(expiresInDays)) {
      // Calculate the future date by adding 'expiresInDays' to the current date
      expiresAtDate = new Date();
      expiresAtDate.setDate(expiresAtDate.getDate() + parseInt(expiresInDays));
    }

    // 5. Create the new URL document using our Mongoose Schema
    const newUrl = new Url({
      originalUrl,
      shortUrl,
      customAlias: customAlias || undefined, // undefined prevents MongoDB unique constraint errors if no alias
      expiresAt: expiresAtDate 
    });

    // 6. Save it to the MongoDB database
    await newUrl.save();

    // 7. Respond back to the React frontend with the newly created URL info
    // We return both the auto-generated shortUrl and the customAlias
    res.status(201).json({
      message: 'Success!',
      originalUrl: newUrl.originalUrl,
      shortCode: newUrl.customAlias || newUrl.shortUrl,
      expiresAt: newUrl.expiresAt
    });

  } catch (error) {
    console.error('Error generating short URL:', error);
    res.status(500).json({ error: 'Server error while generating short URL' });
  }
};

// @route   GET /api/url/analytics/:shortCode
// @desc    Retrieves the total number of clicks and other info for a specific link
const getAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find the URL document trying to match the shortCode against either the shortUrl OR customAlias fields
    const urlDoc = await Url.findOne({
      $or: [{ shortUrl: shortCode }, { customAlias: shortCode }]
    });

    // If we can't find it, return a 404 Not Found error
    if (!urlDoc) {
      return res.status(404).json({ error: 'Short link not found' });
    }

    // If found, return the useful analytics data
    res.status(200).json({
      originalUrl: urlDoc.originalUrl,
      shortCode: urlDoc.customAlias || urlDoc.shortUrl,
      clickCount: urlDoc.clickCount,
      createdAt: urlDoc.createdAt,
      expiresAt: urlDoc.expiresAt
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Server error while fetching analytics' });
  }
};

module.exports = {
  shortenUrl,
  getAnalytics
};
