import express from 'express';
import HeritageSites from '../models/HeritageSites.js';

const router = express.Router();

// GET all destinations (UNESCO sites in Kathmandu Valley)
router.get('/', async (req, res) => {
  try {
    // Fetch from database
    const sites = await HeritageSites.find({ unesco: true });
    
    // Transform to match frontend expectations
    const transformedSites = sites.map(site => ({
      id: site._id,
      name: site.name,
      lat: site.lat,
      lng: site.lng,
      type: site.category,
      description: site.description,
      unesco: site.unesco,
      rating: site.rating
    }));
    
    console.log(`📊 Returning ${transformedSites.length} destinations from database`);
    res.json(transformedSites);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET single destination by ID
router.get('/:id', async (req, res) => {
  try {
    const site = await HeritageSites.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    const transformedSite = {
      id: site._id,
      name: site.name,
      lat: site.lat,
      lng: site.lng,
      type: site.category,
      description: site.description,
      unesco: site.unesco,
      rating: site.rating
    };
    
    res.json(transformedSite);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

export default router;