import cron from 'node-cron';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import { sendNotification } from '../services/notificationService.js';
import { isSameDay } from '../utils/gamification.js';

export const initJobs = () => {
    // Daily Reminder at 8 PM (20:00)
    cron.schedule('0 20 * * *', async () => {
        console.log('Running Daily Reminder Job...');
        try {
            const users = await User.find({});
            const today = new Date();

            for (const user of users) {
                const goals = await Goal.find({ userId: user._id, isCompleted: false });

                // Check if any goal NOT completed today
                const unfinishedGoals = goals.filter(goal => {
                    if (goal.completedDates.length === 0) return true;
                    const lastDate = goal.completedDates[goal.completedDates.length - 1];
                    return !isSameDay(lastDate, today);
                });

                if (unfinishedGoals.length > 0) {
                    await sendNotification(
                        user._id,
                        'Daily Reminder ⚔️',
                        `Don't let your streaks break! You still have ${unfinishedGoals.length} quests to fulfill today.`,
                        'reminder'
                    );
                }
            }
        } catch (error) {
            console.error('Daily Reminder Job failed:', error);
        }
    });

    // Weekly Summary on Sunday at 11 PM
    cron.schedule('0 23 * * 0', async () => {
        console.log('Running Weekly Summary Job...');
        try {
            const users = await User.find({});
            for (const user of users) {
                const goals = await Goal.find({ userId: user._id });
                const totalCompletions = goals.reduce((acc, g) => acc + g.completedDates.length, 0);

                await sendNotification(
                    user._id,
                    'Weekly Battle Report 🏆',
                    `Great work this week! You achieved ${totalCompletions} total quest fulfillments. Keep forging!`,
                    'summary'
                );
            }
        } catch (error) {
            console.error('Weekly Summary Job failed:', error);
        }
    });
};
