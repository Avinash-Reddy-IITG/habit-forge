import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import {
    Trophy, Medal, Award, User, Flame,
    UserPlus, ChevronRight,
    Shield, Zap, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
    const { user } = useAuth();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await api.get('/social/leaderboard');
                setPlayers(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Consulting the Hall of Heroes...</p>
            </div>
        );
    }

    const topPlayer = players[0];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12 pb-20 max-w-6xl mx-auto"
        >
            {/* Header Section */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-400">
                    <Trophy size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Standings</span>
                </div>
                <h2 className="text-6xl font-black italic tracking-tighter text-gradient uppercase">Hall of Heroes</h2>
                <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto italic">
                    "The heights by great men reached and kept were not attained by sudden flight."
                </p>
            </div>

            {/* Top 3 Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-12">
                {players.slice(0, 3).map((player, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;
                    const isThird = index === 2;

                    return (
                        <motion.div
                            key={player.username}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className={`glass-card relative flex flex-col items-center text-center group ${isFirst ? 'pb-12 border-indigo-500/30' : 'scale-90 opacity-80'
                                }`}
                        >
                            {isFirst && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                    <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center neo-glow-primary">
                                        <Trophy size={48} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                                    </div>
                                </div>
                            )}

                            <div className="relative mt-8 mb-6">
                                <div className={`w-28 h-28 rounded-3xl p-1.5 glass border-2 overflow-hidden ${isFirst ? 'border-yellow-500' : isSecond ? 'border-slate-400' : 'border-amber-600'
                                    }`}>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${player.username}&background=${isFirst ? 'eab308' : isSecond ? '94a3b8' : 'd97706'}&color=fff&bold=true&size=200`}
                                        alt="avatar"
                                        className="w-full h-full rounded-2xl object-cover"
                                    />
                                </div>
                                <div className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg border-4 border-slate-900 shadow-2xl ${isFirst ? 'bg-yellow-500' : isSecond ? 'bg-slate-400' : 'bg-amber-600'
                                    }`}>
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-2xl font-black uppercase tracking-tighter truncate w-full px-4">{player.username}</h3>
                            <div className="text-indigo-400 font-black text-sm uppercase tracking-widest mt-1 mb-6">{player.rankScore.toLocaleString()} pts</div>

                            <div className="flex gap-3 w-full">
                                <div className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">Apex Persistence</p>
                                    <div className="flex items-center justify-center gap-1.5 text-orange-400 font-black">
                                        <Flame size={14} className="fill-current" />
                                        {player.longestStreak}D
                                    </div>
                                </div>
                                <div className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">Merits</p>
                                    <div className="flex items-center justify-center gap-1.5 text-indigo-400 font-black">
                                        <Award size={14} />
                                        {player.totalBadges}
                                    </div>
                                </div>
                            </div>

                            {player.username !== user.username && (
                                <button
                                    onClick={async () => {
                                        try {
                                            await api.post('/social/friends/request', { recipientId: player._id });
                                            alert("Connection request deployed.");
                                        } catch (e) {
                                            alert(e.response?.data?.message || "Operational failure.");
                                        }
                                    }}
                                    className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2 group/btn"
                                >
                                    <UserPlus size={16} /> CONNECT
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Global Roster Table */}
            <div className="glass-card !p-0 overflow-hidden border-white/5 shadow-2xl">
                <div className="grid grid-cols-12 gap-4 p-8 bg-slate-800/20 border-b border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                    <div className="col-span-1 text-center font-black">Pos</div>
                    <div className="col-span-6">Persona</div>
                    <div className="col-span-2 text-center">Peak Persistence</div>
                    <div className="col-span-3 text-right">Mastery Rating</div>
                </div>

                <div className="divide-y divide-white/5">
                    {players.slice(3).map((player, index) => (
                        <motion.div
                            key={player.username}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                            className={`grid grid-cols-12 gap-4 p-8 items-center transition-all ${player.username === user.username ? 'bg-indigo-500/5 border-l-4 border-l-indigo-500' : ''
                                }`}
                        >
                            <div className="col-span-1 text-center font-black text-slate-600 text-lg italic">
                                #{index + 4}
                            </div>

                            <div className="col-span-6 flex items-center gap-6">
                                <Link to={`/profile/${player.username}`} className="shrink-0 group">
                                    <div className="w-14 h-14 rounded-2xl glass border-white/10 overflow-hidden p-1 group-hover:border-indigo-500/40 transition-all duration-500 group-hover:scale-105">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${player.username}&background=0f172a&color=6366f1&bold=true&size=100`}
                                            alt="avatar"
                                            className="w-full h-full rounded-xl"
                                        />
                                    </div>
                                </Link>
                                <div className="min-w-0">
                                    <Link to={`/profile/${player.username}`} className="hover:text-indigo-400 transition-colors">
                                        <p className="font-black text-lg uppercase tracking-tight truncate">{player.username}</p>
                                    </Link>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                                            <Award size={12} className="text-indigo-500" /> {player.totalBadges} Merits
                                        </p>
                                        {player.username === user.username && (
                                            <span className="text-[9px] bg-indigo-500 text-white px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">You</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 flex justify-center">
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-orange-500/5 border border-orange-500/10 group">
                                    <Flame size={16} className="text-orange-500 fill-current group-hover:animate-pulse" />
                                    <span className="font-black text-white text-sm tracking-tighter">{player.longestStreak}D</span>
                                </div>
                            </div>

                            <div className="col-span-3 flex items-center justify-end gap-8">
                                <div className="text-right">
                                    <p className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400 leading-none">
                                        {player.rankScore.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mt-1">LVL {Math.floor(player.rankScore / 1000) + 1} EXPERTISE</p>
                                </div>
                                {player.username !== user.username && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.post('/social/friends/request', { recipientId: player._id });
                                                alert("Protocol connection request deployed.");
                                            } catch (e) {
                                                alert(e.response?.data?.message || "Operational failure.");
                                            }
                                        }}
                                        className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-600 hover:text-indigo-400 border border-transparent hover:border-white/5"
                                        title="Connect"
                                    >
                                        <UserPlus size={20} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Contextual Footer */}
            <div className="p-12 text-center glass-card bg-indigo-500/5 border-indigo-500/20">
                <Shield size={40} className="mx-auto text-slate-700 mb-6 opacity-30" />
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Hall of Fame Index</h4>
                <p className="text-slate-600 font-bold uppercase text-[10px] mt-3">Displaying top-tier performers across all sectors.</p>
            </div>
        </motion.div>
    );
};

export default Leaderboard;
