import Goal from '../models/Goal.js';
import User from '../models/User.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch user and all their goals
        const user = await User.findById(userId).select('badges');
        const goals = await Goal.find({ userId });

        // Aggregate stats
        const totalBadges = user.badges.length;
        let longestOverallStreak = 0;
        let totalCurrentStreak = 0;
        let totalGoalsCompleted = 0;
        let allCompletedDates = [];

        const badgesByRarity = {
            Common: 0,
            Rare: 0,
            Epic: 0,
            Legendary: 0,
        };

        user.badges.forEach(badge => {
            if (badgesByRarity[badge.type] !== undefined) {
                badgesByRarity[badge.type]++;
            }
        });

        goals.forEach(goal => {
            totalCurrentStreak += goal.currentStreak;
            if (goal.longestStreak > longestOverallStreak) {
                longestOverallStreak = goal.longestStreak;
            }
            if (goal.isCompleted) {
                totalGoalsCompleted++;
            }
            if (goal.completedDates) {
                allCompletedDates = [...allCompletedDates, ...goal.completedDates];
            }
        });

        res.json({
            totalBadges,
            badgesByRarity,
            longestOverallStreak,
            totalCurrentStreak,
            totalGoalsCompleted,
            activeGoalsCount: goals.length - totalGoalsCompleted,
            allCompletedDates
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
