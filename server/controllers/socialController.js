import User from '../models/User.js';
import Goal from '../models/Goal.js';

export const getLeaderboard = async (req, res) => {
    try {
        const leaderboardData = await User.aggregate([
            {
                $lookup: {
                    from: 'goals',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'goals'
                }
            },
            {
                $project: {
                    username: 1,
                    totalBadges: { $size: '$badges' },
                    longestStreak: { $max: '$goals.longestStreak' }
                }
            },
            {
                $project: {
                    username: 1,
                    totalBadges: 1,
                    longestStreak: { $ifNull: ['$longestStreak', 0] },
                    rankScore: {
                        $add: [
                            { $multiply: [{ $ifNull: ['$longestStreak', 0] }, 10] },
                            { $multiply: ['$totalBadges', 5] }
                        ]
                    }
                }
            },
            { $sort: { rankScore: -1 } },
            { $limit: 50 }
        ]);

        res.json(leaderboardData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('username badges createdAt');

        if (!user) {
            return res.status(404).json({ message: 'Hero not found' });
        }

        const goals = await Goal.find({ userId: user._id }).select('title difficulty targetDays longestStreak currentStreak isCompleted');

        res.json({
            user,
            goals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
