import User from '../models/User.js';
import Goal from '../models/Goal.js';

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalGoals = await Goal.countDocuments({});

        // Calculate system average productivity
        const goals = await Goal.find({});
        let totalCompletedDays = 0;
        let totalTargetDays = 0;

        goals.forEach(goal => {
            totalCompletedDays += goal.completedDates ? goal.completedDates.length : 0;
            totalTargetDays += goal.targetDays || 0;
        });

        const systemProductivity = totalTargetDays > 0
            ? ((totalCompletedDays / totalTargetDays) * 100).toFixed(2)
            : 0;

        res.json({
            totalUsers,
            totalGoals,
            systemProductivity: Number(systemProductivity),
        });
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch admin statistics');
    }
};
