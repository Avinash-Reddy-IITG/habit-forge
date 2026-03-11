export const getCoachTip = (analyticsData, userData) => {
    const { productivityScore, weeklyConsistency, moodTrends } = analyticsData;
    const { username } = userData;

    if (productivityScore > 80) {
        return `Heroic effort, ${username}! You're in the elite tier this week. Your consistency is inspiring. Consider raising the stakes on your next quest!`;
    }

    if (weeklyConsistency < 50) {
        return `The path is tough, ${username}. You've missed a few marks this week. Remember, even a small step today keeps the darkness at bay. Try to hit just one goal today!`;
    }

    if (moodTrends?.length > 0) {
        const lowMoods = moodTrends.filter(m => m.mood === 'low').length;
        if (lowMoods > 2) {
            return `I noticed you've been feeling a bit drained, ${username}. Don't forget to use a Streak Freeze if you need a recovery day. Your mental health is the ultimate quest.`;
        }
    }

    return `Steady progress, ${username}! Keep focused on your daily ranks. You're building a legend, one habit at a time.`;
};
