import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Target, Flame, Trash2, ChevronRight,
    MoreHorizontal, CheckCircle2, AlertCircle,
    Zap, Clock, Shield, X, ChevronDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [targetDays, setTargetDays] = useState(30);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const { data } = await api.get('/goals');
            setGoals(data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const createGoal = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/goals', {
                title,
                description,
                difficulty,
                targetDays: Number(targetDays)
            });
            setGoals([data, ...goals]);
            setShowModal(false);
            setTitle('');
            setDescription('');
            setDifficulty('medium');
            setTargetDays(30);
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    };

    const deleteGoal = async (id) => {
        try {
            await api.delete(`/goals/${id}`);
            setGoals(goals.filter(g => g._id !== id));
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const difficultyConfig = {
        easy: { color: 'var(--secondary)', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', label: 'Level 1' },
        medium: { color: 'var(--primary)', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', label: 'Level 2' },
        hard: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.2)', label: 'Level 3' }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Scanning Tactical Map...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] ml-1">Current Operations</span>
                    <h2 className="text-5xl font-black tracking-tighter uppercase text-gradient">Active Quests</h2>
                    <p className="text-slate-500 font-bold uppercase text-[11px] tracking-widest mt-2">Operational Deployments: {goals.length}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    <span>INITIALIZE NEW QUEST</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {/* Ghost card for adding new goal */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setShowModal(true)}
                        className="glass border-2 border-dashed border-white/10 rounded-[32px] p-8 flex flex-col items-center justify-center text-slate-500 hover:text-secondary hover:border-secondary/40 transition-all group min-h-[300px] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center mb-4 group-hover:border-secondary group-hover:bg-secondary/10 transition-all duration-300 relative z-10 group-hover:scale-110">
                            <Plus size={32} />
                        </div>
                        <span className="font-black uppercase tracking-widest text-xs relative z-10">Initialize New Quest</span>
                    </motion.button>

                    {goals.map((goal) => {
                        const progress = Math.min(100, Math.round((goal.currentStreak / goal.targetDays) * 100));
                        const config = difficultyConfig[goal.difficulty] || difficultyConfig.medium;
                        const gaugeData = [
                            { name: 'Done', value: progress },
                            { name: 'Left', value: 100 - progress }
                        ];

                        return (
                            <motion.div
                                key={goal._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-card flex flex-col relative group overflow-hidden border-2 border-white/5 hover:border-primary/30 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="absolute top-0 right-0 p-2 z-50">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            deleteGoal(goal._id);
                                        }} 
                                        className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all relative"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 shadow-xl">
                                        {config.label}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-orange-500 font-black text-[10px] uppercase italic drop-shadow-[0_0_12px_rgba(249,115,22,0.6)] bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 mr-10">
                                        <Flame size={14} className="fill-current" />
                                        {goal.currentStreak}D PERSISTENCE
                                    </div>
                                </div>

                                <Link to={`/goals/${goal._id}`} className="flex-grow space-y-3 mb-8 relative z-10 group/link">
                                    <h3 className="text-2xl font-black uppercase tracking-tight leading-tight group-hover/link:text-primary transition-colors truncate">
                                        {goal.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed italic pr-4">
                                        "{goal.description || 'No specific combat parameters defined.'}"
                                    </p>
                                </Link>

                                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                    <div className="w-16 h-16 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={gaugeData}
                                                    innerRadius={24}
                                                    outerRadius={30}
                                                    stroke="none"
                                                    dataKey="value"
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    <Cell fill={progress === 100 ? 'var(--secondary)' : 'var(--primary)'} />
                                                    <Cell fill="rgba(255,255,255,0.05)" />
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black italic">
                                            {progress}%
                                        </div>
                                    </div>
                                    <div className="flex-grow space-y-1">
                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter text-slate-500">
                                            <span>PROTOCOL STATUS</span>
                                            <span>{goal.currentStreak}/{goal.targetDays} DAYS</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className={`h-full rounded-full ${progress === 100 ? 'bg-secondary' : 'bg-primary'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="hidden group-hover:block transition-all">
                                        <ChevronRight size={20} className="text-primary" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass-card !p-10 border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.15)]"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Quest Initialization</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Define your quest parameters</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={createGoal} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quest Title</label>
                                    <input
                                        type="text" required value={title} onChange={e => setTitle(e.target.value)}
                                        className="w-full glass bg-white/5 border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition-all font-bold placeholder:text-slate-700"
                                        placeholder="e.g. DAILY NEURAL CALIBRATION"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mission Parameters</label>
                                    <textarea
                                        value={description} onChange={e => setDescription(e.target.value)}
                                        className="w-full glass bg-white/5 border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition-all font-medium resize-none h-24 placeholder:text-slate-700"
                                        placeholder="Provide rationale for engagement..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Intensity Level</label>
                                        <div className="relative">
                                            <select
                                                value={difficulty} onChange={e => setDifficulty(e.target.value)}
                                                className="w-full glass bg-white/5 border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary appearance-none font-bold cursor-pointer"
                                            >
                                                <option value="easy" className="bg-slate-900 text-white">LEVEL 1 (LOW)</option>
                                                <option value="medium" className="bg-slate-900 text-white">LEVEL 2 (MID)</option>
                                                <option value="hard" className="bg-slate-900 text-white">LEVEL 3 (STRICT)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Deployment Cycle</label>
                                        <div className="relative">
                                            <select
                                                required value={targetDays} onChange={e => setTargetDays(e.target.value)}
                                                className="w-full glass bg-white/5 border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary appearance-none font-bold cursor-pointer"
                                            >
                                                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                                                    <option key={day} value={day} className="bg-slate-900 text-white">
                                                        {day} DAY{day !== 1 ? 'S' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 uppercase text-xs font-black tracking-widest">
                                        Abort
                                    </button>
                                    <button type="submit" className="btn-primary flex-1 uppercase text-xs font-black tracking-widest">
                                        Initialize Quest
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Goals;
