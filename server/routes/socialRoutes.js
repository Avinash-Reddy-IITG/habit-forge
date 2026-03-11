import express from 'express';
import { getLeaderboard, getPublicProfile } from '../controllers/socialController.js';
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getPendingRequests,
    getFriends
} from '../controllers/friendController.js';
import { getActivityFeed } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { cache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Leaderboard is perfect for caching (10 mins)
router.get('/leaderboard', cache(600), getLeaderboard);
router.get('/profile/:username', getPublicProfile);

// Friend Routes
router.post('/friends/request', protect, sendFriendRequest);
router.put('/friends/request/:requestId/accept', protect, acceptFriendRequest);
router.put('/friends/request/:requestId/reject', protect, rejectFriendRequest);
router.get('/friends/requests/pending', protect, getPendingRequests);
router.get('/friends', protect, getFriends);

// Activity Feed
router.get('/feed', protect, getActivityFeed);

export default router;
