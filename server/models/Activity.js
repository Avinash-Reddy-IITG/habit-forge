import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['goal_completion', 'badge_unlock', 'streak_milestone'],
        required: true
    },
    description: String,
    metadata: {
        goalId: mongoose.Schema.Types.ObjectId,
        goalTitle: String,
        badgeType: String,
        streakCount: Number
    }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
