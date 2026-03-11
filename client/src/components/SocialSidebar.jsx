import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Activity as ActivityIcon, Check, X, Shield } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const SocialSidebar = () => {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'friends'

    useEffect(() => {
        fetchSocialData();
        const interval = setInterval(fetchSocialData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const fetchSocialData = async () => {
        try {
            const [friendsRes, requestsRes, feedRes] = await Promise.all([
                api.get('/social/friends'),
                api.get('/social/friends/requests/pending'),
                api.get('/social/feed')
            ]);
            setFriends(friendsRes.data);
            setPendingRequests(requestsRes.data);
            setActivities(feedRes.data);
        } catch (error) {
            console.error("Error fetching social data:", error);
        }
    };

    const handleRequest = async (requestId, action) => {
        try {
            await api.put(`/social/friends/request/${requestId}/${action}`);
            fetchSocialData();
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
        }
    };

    return (
        <div className="w-80 h-full flex flex-col glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('feed')}
                    className={`flex-1 p-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'feed' ? 'bg-white/5 text-primary' : 'text-gray-500 hover:text-white'}`}
                >
                    Activity
                </button>
                <button
                    onClick={() => setActiveTab('friends')}
                    className={`flex-1 p-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'friends' ? 'bg-white/5 text-secondary' : 'text-gray-500 hover:text-white'}`}
                >
                    Friends {pendingRequests.length > 0 && <span className="ml-1 text-primary">({pendingRequests.length})</span>}
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'feed' ? (
                        <motion.div
                            key="feed"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            {activities.length === 0 ? (
                                <p className="text-center text-gray-500 text-xs py-10">No recent activity.</p>
                            ) : (
                                activities.map((activity) => (
                                    <div key={activity._id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <ActivityIcon size={14} className="text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{activity.user.username}</p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">{activity.description}</p>
                                                <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase">
                                                    {new Date(activity.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            {pendingRequests.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-tighter">Pending Requests</h4>
                                    {pendingRequests.map(req => (
                                        <div key={req._id} className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <UserPlus size={14} className="text-primary" />
                                                </div>
                                                <span className="text-xs font-bold text-white">{req.sender.username}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleRequest(req._id, 'accept')} className="p-1.5 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors">
                                                    <Check size={14} />
                                                </button>
                                                <button onClick={() => handleRequest(req._id, 'reject')} className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-secondary uppercase tracking-tighter">Your Heroes</h4>
                                {friends.length === 0 ? (
                                    <p className="text-center text-gray-500 text-xs py-4">No friends yet. Reaching out is a hero's path!</p>
                                ) : (
                                    friends.map(friend => (
                                        <div key={friend._id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:border-secondary/40">
                                                <Users size={16} className="text-secondary" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-xs font-bold text-white truncate">{friend.username}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Shield size={10} className="text-accent" />
                                                    <span className="text-[10px] text-accent font-black uppercase">{friend.badges.length} Merits</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SocialSidebar;
