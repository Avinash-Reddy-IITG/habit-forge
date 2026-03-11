import Notification from '../models/Notification.js';

export const sendNotification = async (userId, title, message, type = 'reminder') => {
    try {
        await Notification.create({
            userId,
            title,
            message,
            type
        });
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

export const getUnreadNotifications = async (userId) => {
    return await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
};

export const markAsRead = async (notificationId) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true });
};
