import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

// Send friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const { recipientId } = req.body;
        const senderId = req.user._id;

        if (senderId.toString() === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: senderId,
            recipient: recipientId
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await FriendRequest.findById(requestId);

        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: "Friend request not found or already processed" });
        }

        if (request.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        request.status = 'accepted';
        await request.save();

        // Add to each other's friends list
        await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.recipient } });
        await User.findByIdAndUpdate(request.recipient, { $addToSet: { friends: request.sender } });

        res.json({ message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject friend request
export const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await FriendRequest.findById(requestId);

        if (!request || request.status !== 'pending') {
            return res.status(404).json({ message: "Friend request not found or already processed" });
        }

        if (request.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        request.status = 'rejected';
        await request.save();

        res.json({ message: "Friend request rejected" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get pending requests
export const getPendingRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            recipient: req.user._id,
            status: 'pending'
        }).populate('sender', 'username badges');

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get friends list
export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friends', 'username badges');
        res.json(user.friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
