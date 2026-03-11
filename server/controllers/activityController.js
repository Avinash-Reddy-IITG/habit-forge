import Activity from '../models/Activity.js';
import User from '../models/User.js';

export const getActivityFeed = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const userAndFriendIds = [user._id, ...user.friends];

        const activities = await Activity.find({ user: { $in: userAndFriendIds } })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('user', 'username');

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
