export const calculateEarnedBadge = (goal, currentStreak) => {
    // Only award badge if the streak exactly hits the target days
    if (currentStreak !== goal.targetDays) {
        return null;
    }

    const difficultyMultiplier = {
        easy: 1,
        medium: 2,
        hard: 3
    };

    const multiplier = difficultyMultiplier[goal.difficulty] || 2;
    const rarityScore = goal.targetDays * multiplier;

    let rarityType = 'Common';
    if (rarityScore >= 60) rarityType = 'Legendary';
    else if (rarityScore >= 30) rarityType = 'Epic';
    else if (rarityScore >= 10) rarityType = 'Rare';

    return {
        type: rarityType,
        description: `Achieved ${goal.targetDays}-day streak for: ${goal.title}`,
        earnedAt: new Date()
    };
};

// Helper to check if a date is "yesterday" relative to today
export const isYesterday = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Normalize to 00:00:00
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};

export const getDiffDays = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper to check if dates are same day
export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};
