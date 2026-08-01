import { Router } from "express";

import {
  getAllDestinations,
  getDestinationById,
  createDestination,
} from "../../controllers/destinations.controller.js";

const router = Router();

router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);
router.post("/", createDestination);

export default router;