import express from 'express';
import Place from '../models/Place.js';

const router = express.Router();

// GET all places
router.get('/', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET nearby places
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 1500 } = req.query;

    const places = await Place.find();

    // simple distance calculation
    const nearby = places.filter((place) => {
      const distance = Math.sqrt(
        Math.pow(place.lat - lat, 2) +
        Math.pow(place.lng - lng, 2)
      );

      return distance < 0.02; // roughly ~2 km
    });

    res.json(nearby);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;