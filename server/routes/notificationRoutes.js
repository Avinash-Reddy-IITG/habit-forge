import express from 'express';
import { getUnreadNotifications, markAsRead } from '../services/notificationService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
    try {
        const notifications = await getUnreadNotifications(req.user._id);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id/read', protect, async (req, res) => {
    try {
        await markAsRead(req.params.id);
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
