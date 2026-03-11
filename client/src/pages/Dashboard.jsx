import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award, Flame, Target, Trophy, Star, Shield, Zap,
    TrendingUp, Activity, CheckCircle2, ChevronRight,
    ArrowUpRight, Info
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import AICoachWidget from '../components/AICoachWidget';

const Dashboard = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7D');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard');
                setStats(data);
                await updateProfile();
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-6">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Initializing Neural Forge...</p>
            </div>
        );
    }

    const daysToView = timeRange === '90D' ? 90 : timeRange === '30D' ? 30 : 7;
    const chartData = Array.from({ length: daysToView }).map((_, i) => {
        const date = subDays(new Date(), (daysToView - 1) - i);
        return {
            name: daysToView > 7 ? format(date, 'MMM dd') : format(date, 'EEE'),
            value: stats?.allCompletedDates?.some(d => isSameDay(parseISO(d), date)) ? 100 : 30
        };
    });

    const completionRate = stats?.activeGoalsCount > 0
        ? Math.round((stats.totalCurrentStreak / (stats.activeGoalsCount * 7)) * 100)
        : 0;

    const gaugeData = [
        { name: 'Completed', value: Math.min(completionRate || 85, 100) },
        { name: 'Remaining', value: 100 - Math.min(completionRate || 85, 100) }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] ml-1">Personnel Overview</span>
                    <h2 className="text-7xl font-black tracking-tight text-gradient leading-[0.9] uppercase">
                        Mastery<br />Candidate <span className="text-white/40">{user?.username?.toUpperCase()}</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-lg italic mt-4 max-w-xl">
                        "Precision is the difference between intent and achievement."
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/goals')}
                        className="btn-primary"
                    >
                        <Zap size={20} className="fill-current" /> INITIALIZE QUEST
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/analytics')}
                        className="btn-outline"
                    >
                        <TrendingUp size={20} /> ANALYSIS
                    </motion.button>
                </div>
            </div>

            {/* Core Metrics Grid */}
            <motion.div
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: 'Current Persistence', value: stats?.totalCurrentStreak || 0, unit: 'Days', icon: Flame, color: 'text-orange-500' },
                    { label: 'Record Persistence', value: stats?.longestOverallStreak || 0, unit: 'Days', icon: Trophy, color: 'text-indigo-400' },
                    { label: 'Active Quests', value: stats?.activeGoalsCount || 0, unit: 'Active', icon: Target, color: 'text-sky-400' },
                    { label: 'Merits Archived', value: stats?.totalBadges || 0, unit: 'Merits', icon: Award, color: 'text-emerald-400' }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 }
                        }}
                        className="stat-card p-8 group overflow-hidden"
                    >
                        <div className={`absolute top-4 right-4 ${item.color} opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500`}>
                            <item.icon size={64} className={item.icon === Flame ? 'fill-current' : ''} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{item.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-6xl font-black tracking-tighter">{item.value}</h4>
                            <span className={`${item.color} font-black italic uppercase text-[10px]`}>{item.unit}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Analytics & AI Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card !p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Neural Momentum</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Temporal Analysis of Behavioral Persistence</p>
                        </div>
                        <div className="bg-slate-800/50 p-1.5 rounded-xl flex gap-1">
                            {['7D', '30D', '90D'].map(t => (
                                <button 
                                    key={t} 
                                    onClick={() => setTimeRange(t)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                                    dy={15}
                                />
                                <YAxis hide domain={[0, 120]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}
                                    cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4f46e5"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    dot={{ r: 4, fill: '#020617', stroke: '#4f46e5', strokeWidth: 2 }}
                                    activeDot={{ r: 7, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-8 flex flex-col">
                    {/* Stability Gauge */}
                    <div className="glass-card !p-8 flex flex-col items-center text-center">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 w-full text-left">Stability Index</h3>
                        <div className="h-48 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gaugeData}
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="value"
                                        startAngle={210}
                                        endAngle={-30}
                                        stroke="none"
                                    >
                                        <Cell fill="url(#indigo-grad)" className="drop-shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
                                        <Cell fill="rgba(255,255,255,0.03)" />
                                    </Pie>
                                    <defs>
                                        <linearGradient id="indigo-grad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#4f46e5" />
                                            <stop offset="100%" stopColor="#0ea5e9" />
                                        </linearGradient>
                                    </defs>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                                <span className="text-4xl font-black tracking-tighter">{gaugeData[0].value}%</span>
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Consistency</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-4">Maintaining highly optimal neural growth parameters.</p>
                    </div>

                    {/* AI Coach Tactical Card */}
                    {stats?.coachTip && (
                        <div className="glass-card !p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 relative overflow-hidden flex-grow group">
                            <div className="absolute -top-6 -right-6 text-indigo-500/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                                <Activity size={120} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Zap size={18} className="fill-current" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Tactical Strategy</h3>
                                </div>
                                <p className="text-lg font-bold italic leading-tight text-white/90">
                                    "{stats.coachTip}"
                                </p>
                                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 group/btn">
                                    INTEGRATE PROTOCOL <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Achievement Timeline */}
            <div className="glass-card !p-10">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Star size={24} className="text-yellow-500 fill-current drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]" /> Historical Merits
                    </h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                        View Hall of Fame
                    </button>
                </div>

                {user?.badges && user.badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {user.badges.slice(0, 6).map((badge, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -8 }}
                                className="flex flex-col items-center text-center p-6 bg-slate-900/40 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-white/5 relative z-10 group-hover:scale-110 transition-transform duration-500">
                                    <Award size={32} className={badge.type === 'Legendary' ? 'text-yellow-400' : 'text-indigo-400'} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1 relative z-10">{badge.type}</p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase relative z-10">{format(parseISO(badge.earnedAt), 'MMM yyyy')}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-700 space-y-4">
                        <Shield size={64} className="opacity-10" />
                        <p className="text-[11px] font-black uppercase tracking-[0.3em]">No merits archived in recent sector cycle</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Dashboard;
