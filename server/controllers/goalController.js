import Goal from '../models/Goal.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { calculateEarnedBadge, isYesterday, isSameDay, getDiffDays } from '../utils/gamification.js';

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
    try {
        const { title, description, difficulty, targetDays } = req.body;

        const goal = await Goal.create({
            userId: req.user._id,
            title,
            description,
            difficulty,
            targetDays,
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a goal (mark day complete)
// @route   PUT /api/goals/:id/complete
// @access  Private
export const markGoalComplete = async (req, res) => {
    try {
        const { mood } = req.body;
        const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.isCompleted) {
            return res.status(400).json({ message: 'Goal is already fully completed' });
        }

        const today = new Date();

        // Add mood log if provided
        if (mood && ['happy', 'neutral', 'low'].includes(mood)) {
            goal.moodLogs.push({ date: today, mood });
        }

        let isRecovery = false;

        if (goal.completedDates.length > 0) {
            const lastDate = goal.completedDates[goal.completedDates.length - 1];
            if (isSameDay(lastDate, today)) {
                return res.status(400).json({ message: 'Already marked complete for today' });
            }

            const diffDays = getDiffDays(lastDate, today);

            if (diffDays === 1) {
                // Perfect continuation
                goal.currentStreak += 1;
            } else if (diffDays === 2) {
                // Missed exactly one day. Check if we can use a Streak Freeze!
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();

                // Has user already used a freeze THIS month for THIS goal?
                const freezeUsedThisMonth = goal.freezesUsed.some(freezeDate => {
                    const d = new Date(freezeDate);
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                });

                if (!freezeUsedThisMonth) {
                    // Apply Streak Freeze!
                    goal.freezesUsed.push(today);
                    goal.currentStreak += 1;
                    // Note: the streak didn't break.
                } else {
                    // Streak broken
                    goal.currentStreak = 1;
                    isRecovery = true; // Started recovering immediately next day after break
                }
            } else {
                // Missed 2 or more days. Streak broken and no freeze can save a 2-day gap.
                goal.currentStreak = 1;
                if (diffDays === 3) {
                    isRecovery = true;
                }
            }
        } else {
            // First ever completion
            goal.currentStreak = 1;
        }

        // Update longest streak
        if (goal.currentStreak > goal.longestStreak) {
            goal.longestStreak = goal.currentStreak;
        }

        // Record completion
        goal.completedDates.push(today);

        if (goal.currentStreak >= goal.targetDays) {
            goal.isCompleted = true;
        }

        let newBadge = calculateEarnedBadge(goal, goal.currentStreak);

        // Recovery Bonus Logic (If the user recovered immediately after losing a streak)
        if (isRecovery && !newBadge) {
            newBadge = {
                type: 'Common',
                description: `Resilience: Bounced back immediately after losing a streak for ${goal.title}`,
                earnedAt: new Date()
            };
        }

        await goal.save();

        // Log Activity: Goal Completion
        await Activity.create({
            user: req.user._id,
            type: 'goal_completion',
            description: `completed a session for ${goal.title}`,
            metadata: {
                goalId: goal._id,
                goalTitle: goal.title,
                streakCount: goal.currentStreak
            }
        });

        // If a badge was earned, save it to the user and log activity
        if (newBadge) {
            const user = await User.findById(req.user._id);
            user.badges.push(newBadge);
            await user.save();

            await Activity.create({
                user: req.user._id,
                type: 'badge_unlock',
                description: `unlocked a ${newBadge.type} badge: ${newBadge.description}`,
                metadata: {
                    badgeType: newBadge.type
                }
            });
        }

        res.json({ goal, newBadge });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
