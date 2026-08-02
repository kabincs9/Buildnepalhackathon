import express from 'express';
import HeritageSites from '../models/HeritageSites.js';

const router = express.Router();

// GET all heritage sites
router.get('/', async (req, res) => {
  try {
    const sites = await HeritageSites.find({});
    
    const transformedSites = sites.map(site => ({
      id: site._id,
      name: site.name,
      lat: site.lat,
      lng: site.lng,
      type: site.category,
      description: site.description,
      unesco: site.unesco,
      rating: site.rating,
      openingHours: site.openingHours,
      entryFee: site.entryFee
    }));
    
    console.log(`📊 Returning ${transformedSites.length} heritage sites`);
    res.json(transformedSites);
  } catch (error) {
    console.error('Error fetching heritage sites:', error);
    res.status(500).json({ error: 'Failed to fetch heritage sites' });
  }
});

// GET single heritage site by ID
router.get('/:id', async (req, res) => {
  try {
    const site = await HeritageSites.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: 'Heritage site not found' });
    }
    
    const transformedSite = {
      id: site._id,
      name: site.name,
      lat: site.lat,
      lng: site.lng,
      type: site.category,
      description: site.description,
      unesco: site.unesco,
      rating: site.rating,
      openingHours: site.openingHours,
      entryFee: site.entryFee
    };
    
    res.json(transformedSite);
  } catch (error) {
    console.error('Error fetching heritage site:', error);
    res.status(500).json({ error: 'Failed to fetch heritage site' });
  }
});

export default router;