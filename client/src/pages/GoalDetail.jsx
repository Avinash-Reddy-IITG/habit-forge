import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame, Trophy, Calendar as CalendarIcon,
    CheckCircle, ArrowLeft, Award, Zap,
    Shield, Target, Info, CheckCircle2,
    Activity, Smile, Meh, Frown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isSameDay, parseISO, format } from 'date-fns';
import BadgeUnlockModal from '../components/BadgeUnlockModal';

const GoalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateProfile } = useAuth();

    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [earnedBadge, setEarnedBadge] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedMood, setSelectedMood] = useState('');

    useEffect(() => {
        fetchGoal();
    }, [id]);

    const fetchGoal = async () => {
        try {
            const { data } = await api.get('/goals');
            const foundGoal = data.find(g => g._id === id);
            setGoal(foundGoal);
        } catch (error) {
            console.error('Error fetching goal details:', error);
        } finally {
            setLoading(false);
        }
    };

    const markComplete = async () => {
        setActionLoading(true);
        try {
            const payload = selectedMood ? { mood: selectedMood } : {};
            const { data } = await api.put(`/goals/${id}/complete`, payload);
            setGoal(data.goal);
            if (data.newBadge) {
                setEarnedBadge(data.newBadge);
                updateProfile();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Error marking complete');
        } finally {
            setActionLoading(false);
        }
    };

    const isCompletedToday = () => {
        if (!goal || !goal.completedDates || goal.completedDates.length === 0) return false;
        const lastDate = parseISO(goal.completedDates[goal.completedDates.length - 1]);
        return isSameDay(lastDate, new Date());
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && goal?.completedDates) {
            const isCompleted = goal.completedDates.some(d => isSameDay(parseISO(d), date));
            if (isCompleted) {
                return `react-calendar__tile--complete diff-primary`;
            }
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Quest Telemetry...</p>
            </div>
        );
    }

    if (!goal) return <div className="text-center mt-20 font-black uppercase text-slate-500">Quest Not Found in Database.</div>;

    const progress = Math.min(100, Math.round((goal.currentStreak / goal.targetDays) * 100));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-20"
        >
            <header className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/goals')}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                    <ArrowLeft size={16} /> Back to Tactical Map
                </button>
                <div className="flex gap-2">
                    <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">Quest Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Quest Content */}
                    <div className="glass-card relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={120} /></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${goal.difficulty === 'hard' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                    goal.difficulty === 'medium' ? 'bg-primary/10 text-primary border border-primary/20' :
                                        'bg-secondary/10 text-secondary border border-secondary/20'
                                    }`}>
                                    Level {goal.difficulty === 'hard' ? '3' : goal.difficulty === 'medium' ? '2' : '1'} Intensity
                                </span>
                            </div>

                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">{goal.title}</h2>
                            <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-2xl italic">
                                "{goal.description || 'No additional mission context provided.'}"
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Persistence</p>
                                    <div className="flex items-center gap-2">
                                        <Flame size={20} className="text-orange-500 fill-current" />
                                        <span className="text-2xl font-black italic">{goal.currentStreak}D</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Record Multiplier</p>
                                    <div className="flex items-center gap-2">
                                        <Trophy size={20} className="text-yellow-500" />
                                        <span className="text-2xl font-black italic">{goal.longestStreak}D</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Deployment Efficiency</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-grow h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className={`h-full rounded-full ${progress === 100 ? 'bg-secondary' : 'bg-primary'}`}
                                            />
                                        </div>
                                        <span className="text-sm font-black italic whitespace-nowrap">{progress}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Journey Calendar */}
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-400">
                                <CalendarIcon size={14} /> Protocol Log
                            </h3>
                        </div>

                        <div className="calendar-container">
                            <Calendar
                                tileClassName={tileClassName}
                                className="w-full !bg-transparent !border-none text-white font-['Outfit']"
                            />
                        </div>

                        <style>{`
                            .react-calendar__navigation button {
                                @apply text-white font-black uppercase tracking-widest text-[10px] p-2 hover:bg-white/5 rounded-lg transition-colors;
                            }
                            .react-calendar__month-view__weekdays__weekday {
                                @apply !no-underline;
                            }
                            .react-calendar__month-view__weekdays__weekday abbr {
                                @apply text-[9px] font-black text-slate-600 uppercase no-underline;
                            }
                            .react-calendar__tile {
                                @apply text-xs font-bold p-4 bg-transparent hover:bg-white/5 rounded-xl transition-all duration-200 border border-transparent;
                            }
                            .react-calendar__tile--now {
                                @apply border-primary/40 bg-primary/5 !text-primary;
                            }
                            .react-calendar__tile--active {
                                @apply !bg-primary/20 !text-white;
                            }
                            .react-calendar__tile--complete.diff-primary {
                                @apply !bg-primary/20 !text-primary border-primary/30 neo-glow-primary;
                                --primary-glow: rgba(59, 130, 246, 0.2);
                            }
                        `}</style>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Action Hub */}
                    <div className="glass-card flex flex-col items-center">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 w-full">Duty Status</h3>

                        {goal.isCompleted ? (
                            <div className="py-10 text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto border-2 border-secondary/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h4 className="text-xl font-black uppercase italic tracking-tight">Quest Accomplished</h4>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Mastery Level Attained</p>
                            </div>
                        ) : (
                            <div className="w-full space-y-8">
                                {!isCompletedToday() ? (
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <p className="text-[11px] font-medium text-slate-400 mb-4 uppercase tracking-tight italic leading-relaxed">"Confirm operational success for today's cycle and log neural state."</p>
                                            <div className="flex justify-center gap-6">
                                                {[
                                                    { mood: 'happy', icon: Smile, color: 'text-secondary' },
                                                    { mood: 'neutral', icon: Meh, color: 'text-primary' },
                                                    { mood: 'low', icon: Frown, color: 'text-red-500' }
                                                ].map(({ mood, icon: Icon, color }) => (
                                                    <button
                                                        key={mood}
                                                        onClick={() => setSelectedMood(mood)}
                                                        className={`p-3 rounded-2xl transition-all border ${selectedMood === mood
                                                            ? `${color} bg-white/5 border-current neo-glow-primary scale-110`
                                                            : 'text-slate-600 border-white/5 hover:text-white hover:bg-white/5'
                                                            }`}
                                                        style={{ '--primary-glow': 'currentColor' }}
                                                    >
                                                        <Icon size={24} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={markComplete}
                                            disabled={actionLoading}
                                            className="btn-primary w-full !py-5 flex items-center justify-center gap-3 font-black uppercase tracking-widest group text-sm"
                                        >
                                            {actionLoading ? 'EXECUTING...' : 'EXECUTE PROTOCOL'}
                                            {!actionLoading && <Zap size={18} className="group-hover:translate-y-[-2px] transition-transform" />}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto border border-white/10">
                                            <CheckCircle size={32} />
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Cycle Recorded</p>
                                        <p className="text-[10px] font-bold text-slate-600">Next window opens in {24 - new Date().getHours()} hours.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="glass-card">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Quest Parameters</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Start Date</span>
                                <span className="text-xs font-black uppercase">{format(parseISO(goal.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Volume</span>
                                <span className="text-xs font-black uppercase">{goal.completedDates?.length || 0} Successful Cycles</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Operational Status</span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${goal.isCompleted ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                                    {goal.isCompleted ? 'MASTERY' : 'ACTIVE_DUTY'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-4">
                        <Info size={20} className="text-primary shrink-0" />
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">
                            Maintaining daily logs increases neural stability by <span className="text-primary font-black italic">14%</span> across all sectors.
                        </p>
                    </div>
                </div>
            </div>

            <BadgeUnlockModal
                badge={earnedBadge}
                onClose={() => setEarnedBadge(null)}
            />
        </motion.div>
    );
};

export default GoalDetail;
