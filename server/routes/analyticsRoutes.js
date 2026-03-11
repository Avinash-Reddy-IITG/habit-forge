import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { cache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Cache analytics for 5 minutes since they are calculation heavy
router.get('/', protect, cache(300), getAnalytics);

export default router;
