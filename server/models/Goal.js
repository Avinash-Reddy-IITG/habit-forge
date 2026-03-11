import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    targetDays: {
        type: Number,
        required: true,
        min: 1
    },
    completedDates: [{
        type: Date
    }],
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    freezesUsed: [{
        type: Date
    }],
    moodLogs: [{
        date: Date,
        mood: {
            type: String,
            enum: ['happy', 'neutral', 'low']
        }
    }]
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
