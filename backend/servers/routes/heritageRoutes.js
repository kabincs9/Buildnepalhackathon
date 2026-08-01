import express from 'express';
import HeritageSite from "../models/HeritageSites.js";
const router = express.Router();

// GET all heritage sites
router.get('/', async (req, res) => {
  try {
    const sites = await HeritageSite.find();
    res.json(sites);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;