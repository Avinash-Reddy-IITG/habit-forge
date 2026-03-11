import Goal from '../models/Goal.js';

export const calculateProductivityScore = (goal) => {
    if (!goal.completedDates || goal.completedDates.length === 0) return 0;

    const totalTrackedDays = Math.ceil((new Date() - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24)) || 1;
    const completedDays = goal.completedDates.length;

    const difficultyMultiplier = {
        easy: 1,
        medium: 2,
        hard: 3
    };
    const difficultyWeight = difficultyMultiplier[goal.difficulty] || 1.5;

    // Consistency factor: ratio of current streak to target days (bonus for hitting milestones)
    const consistencyFactor = goal.currentStreak / goal.targetDays;

    const score = (completedDays / totalTrackedDays) * difficultyWeight * (1 + consistencyFactor);

    return Math.min(100, (score * 20)).toFixed(2); // Scale to 100
};

export const getWeeklyConsistency = (goals) => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        return d;
    });

    let completedCount = 0;
    last7Days.forEach(day => {
        const anyGoalCompleted = goals.some(goal =>
            goal.completedDates.some(cd => {
                const d = new Date(cd);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === day.getTime();
            })
        );
        if (anyGoalCompleted) completedCount++;
    });

    return ((completedCount / 7) * 100).toFixed(2);
};
