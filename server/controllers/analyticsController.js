import Goal from '../models/Goal.js';
import { calculateProductivityScore, getWeeklyConsistency } from '../services/analyticsService.js';
import { getCoachTip } from '../services/coachService.js';

export const getAnalytics = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id });

        if (!goals || goals.length === 0) {
            return res.json({
                productivityScore: 0,
                weeklyConsistency: 0,
                completionRate: 0,
                chartData: [],
                moodCorrelation: []
            });
        }

        const productivityScore = goals.reduce((acc, goal) => acc + Number(calculateProductivityScore(goal)), 0) / goals.length;
        const weeklyConsistency = getWeeklyConsistency(goals);

        // Completion Rate
        let totalCompleted = 0;
        let totalTarget = 0;
        goals.forEach(g => {
            totalCompleted += g.completedDates.length;
            totalTarget += g.targetDays;
        });
        const completionRate = ((totalCompleted / totalTarget) * 100).toFixed(2);

        // Chart Data (Last 7 days completions)
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const count = goals.reduce((acc, goal) => {
                return acc + goal.completedDates.filter(cd => {
                    const d = new Date(cd);
                    return d.getDate() === date.getDate() &&
                        d.getMonth() === date.getMonth() &&
                        d.getFullYear() === date.getFullYear();
                }).length;
            }, 0);

            chartData.push({
                name: dayNames[date.getDay()],
                completions: count
            });
        }

        // Mood Correlation
        const moods = { happy: 0, neutral: 0, low: 0 };
        const moodCounts = { happy: 0, neutral: 0, low: 0 };

        goals.forEach(goal => {
            goal.moodLogs.forEach(log => {
                moodCounts[log.mood]++;
            });
        });

        const moodData = Object.keys(moodCounts).map(m => ({
            mood: m,
            count: moodCounts[m]
        }));

        // AI Coach Tip
        const coachTip = getCoachTip({ productivityScore, weeklyConsistency, moodTrends: moodData }, req.user);

        res.json({
            productivityScore: Number(productivityScore).toFixed(2),
            weeklyConsistency,
            completionRate,
            chartData,
            moodData,
            coachTip
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
