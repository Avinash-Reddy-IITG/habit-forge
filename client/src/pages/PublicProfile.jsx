import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Shield, Target, Flame, Trophy,
    Award, Calendar, UserPlus, ChevronLeft,
    Star, Zap, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';

const PublicProfile = () => {
    const { user } = useAuth();
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/social/profile/${username}`);
                setProfile(data);
            } catch (error) {
                console.error("Error fetching public profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Accessing Identity Matrix...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 opacity-50">
                    <Shield size={48} className="text-slate-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Identity Not Found</h2>
                    <p className="text-slate-500 font-bold uppercase text-[10px] mt-2 tracking-widest">The requested subject is not in our database.</p>
                </div>
                <Link to="/leaderboard" className="btn-outline !py-3 !px-6 text-[10px]">
                    <ChevronLeft size={16} /> RETURN TO HALL OF HEROES
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20 max-w-6xl mx-auto"
        >
            {/* Profile Header Card */}
            <div className="stat-card !p-12 relative overflow-hidden group">
                {/* Background Decorative Element */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-700" />

                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-48 h-48 rounded-[40px] glass p-1.5 border-2 border-indigo-500/30 shadow-2xl overflow-hidden relative"
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${profile.user.username}&background=0f172a&color=6366f1&bold=true&size=512`}
                                alt="avatar"
                                className="w-full h-full rounded-[34px] object-cover"
                            />
                        </motion.div>
                        <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white border-4 border-[#020617] shadow-xl neo-glow-primary">
                            <Zap size={24} className="fill-current" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-6 flex-grow">
                        <div>
                            <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Mastery Candidate</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Status: Elite
                                </span>
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter uppercase leading-none text-gradient">{profile.user.username}</h2>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="bg-slate-900/50 border border-white/5 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                                ENLISTED {format(parseISO(profile.user.createdAt), 'MMMM yyyy').toUpperCase()}
                            </span>
                        </div>

                        <p className="text-slate-400 font-medium italic text-xl leading-relaxed max-w-xl">
                            "Building unbreakable systems, one habit at a time. The Forge is where discipline meets destiny."
                        </p>

                        <div className="flex gap-4 sm:flex-row flex-col pt-4">
                            {user && user.username !== profile.user.username && (
                                <button
                                    onClick={async () => {
                                        try {
                                            await api.post('/social/friends/request', { recipientId: profile.user._id });
                                            alert("Strategic connection initialized.");
                                        } catch (e) {
                                            alert(e.response?.data?.message || "Operational failure.");
                                        }
                                    }}
                                    className="btn-primary !px-10"
                                >
                                    <UserPlus size={20} /> CONNECT PERSONA
                                </button>
                            )}
                            <Link to="/leaderboard" className="btn-outline !px-10">
                                <ChevronLeft size={20} /> HALL OF HEROES
                            </Link>
                        </div>
                    </div>

                    <div className="flex md:flex-col gap-12 shrink-0 border-l border-white/5 pl-12 hidden lg:flex">
                        <div className="text-center">
                            <p className="text-5xl font-black text-indigo-400 tracking-tighter">{profile.goals.length}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">ACTIVE QUESTS</p>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-black text-sky-400 tracking-tighter">{profile.user.badges.length}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">MERITS ARCHIVED</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Active Quests */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-base font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                            <Target size={18} className="text-indigo-500" /> Operational Quests
                        </h3>
                        <span className="text-[10px] font-black text-slate-600 uppercase">Live Intel</span>
                    </div>

                    <div className="space-y-6">
                        {profile.goals.map((goal) => (
                            <motion.div
                                key={goal._id}
                                whileHover={{ x: 10 }}
                                className="glass-card !p-8 flex flex-col group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity size={80} />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <h4 className="font-black text-2xl uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{goal.title}</h4>
                                    <div className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-xl border ${goal.difficulty === 'hard' ? 'bg-red-500/5 border-red-500/20 text-red-500' :
                                        goal.difficulty === 'medium' ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400' :
                                            'bg-sky-500/5 border-sky-500/20 text-sky-400'
                                        }`}>
                                        RANK {goal.difficulty === 'hard' ? 'III' : goal.difficulty === 'medium' ? 'II' : 'I'}
                                    </div>
                                </div>
                                <div className="flex gap-8 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                            <Flame size={16} className="text-orange-500 fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PERSISTENCE</p>
                                            <p className="font-black text-lg text-white leading-none">{goal.currentStreak}D</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 border-l border-white/5 pl-8">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                            <Trophy size={16} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">APEX</p>
                                            <p className="font-black text-lg text-white leading-none">{goal.longestStreak}D</p>
                                        </div>
                                    </div>
                                    {goal.isCompleted && (
                                        <div className="ml-auto flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-2xl border border-emerald-500/20">
                                            <Award size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">MASTERED</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Merit Archive */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-base font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                            <Award size={18} className="text-sky-500" /> Merit Repository
                        </h3>
                        <span className="text-[10px] font-black text-slate-600 uppercase">Archive</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {profile.user.badges.map((badge, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="glass-card flex flex-col items-center text-center space-y-6 !p-8 group"
                            >
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border transition-all duration-500 ${badge.type === 'Legendary' ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.1)]' :
                                    badge.type === 'Epic' ? 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400' :
                                        badge.type === 'Rare' ? 'border-sky-500/30 bg-sky-500/5 text-sky-400' :
                                            'border-slate-500/30 bg-slate-500/5 text-slate-400'
                                    }`}>
                                    <Award size={36} className="group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{badge.type}</p>
                                    <div className="w-8 h-0.5 bg-white/10 mx-auto rounded-full" />
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{format(new Date(badge.earnedAt), 'MMM yyyy')}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {profile.user.badges.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-700 bg-slate-900/20 rounded-[40px] border border-white/5 border-dashed">
                            <Shield size={64} className="opacity-10 mb-6" />
                            <p className="text-[11px] font-black uppercase tracking-[0.4em]">No merits currently cached</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Footer */}
            <div className="p-16 text-center glass-card bg-indigo-600/5 border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                <Shield size={48} className="mx-auto text-slate-700 mb-6 opacity-30" />
                <h4 className="text-xs font-black uppercase tracking-[0.5em] text-slate-500">Personnel Archive Terminal</h4>
                <p className="text-slate-600 font-bold uppercase text-[10px] mt-4 tracking-widest leading-loose">
                    This profile is a verified record of neural link progress within the HabitForge ecosystem.<br />
                    Data integrity confirmed. Stay relentless.
                </p>
            </div>
        </motion.div>
    );
};

export default PublicProfile;
