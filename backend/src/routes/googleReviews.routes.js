const express = require('express');
const axios = require('axios');

const router = express.Router();

// ======================================================
// GOOGLE REVIEWS API ROUTE
// ======================================================
router.get('/google-reviews', async (req, res) => {
  try {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!placeId || !apiKey) {
      return res.status(500).json({
        error: 'Missing GOOGLE_PLACE_ID or GOOGLE_API_KEY'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,reviews,user_ratings_total&key=${apiKey}`;

    const response = await axios.get(url);

    console.log('Google API raw response:', response.data);

    if (response.data.status !== 'OK') {
      return res.status(500).json({
        error: response.data.status,
        message: response.data.error_message || 'Google API error'
      });
    }

    const result = response.data.result || {};

    res.json({
      rating: result.rating || null,
      totalReviews: result.user_ratings_total || 0,
      reviews: result.reviews || []
    });

  } catch (error) {
    console.error('Google Reviews Error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch Google reviews'
    });
  }
});

module.exports = router;