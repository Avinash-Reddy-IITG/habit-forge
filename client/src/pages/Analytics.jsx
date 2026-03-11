import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import {
    Activity, BarChart2, TrendingUp, Smile, Calendar,
    Target, Zap, Shield, ChevronRight, Info
} from 'lucide-react';

const Analytics = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/analytics');
                setData(data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Parsing Performance Metrics...</p>
            </div>
        );
    }

    const moodColors = {
        happy: 'var(--secondary)',
        neutral: 'var(--primary)',
        low: '#f43f5e'
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
        >
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase leading-none mb-2">Strategic Intelligence</h2>
                    <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em]">Heuristic Neural Analysis Layer</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-card !p-4 flex items-center gap-4 bg-primary/5 border-primary/20">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary neo-glow-primary">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Productivity Quotient</p>
                            <p className="text-xl font-black text-white">{data?.productivityScore}%</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp size={60} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Weekly Consistency</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-4xl font-black">{data?.weeklyConsistency}%</h4>
                        <span className="text-emerald-500 text-[10px] font-black italic uppercase">Stable</span>
                    </div>
                </div>
                <div className="glass-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BarChart2 size={60} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Protocol Success Rate</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-4xl font-black">{data?.completionRate}%</h4>
                        <span className="text-primary text-[10px] font-black italic uppercase">Optimal</span>
                    </div>
                </div>
                <div className="glass-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Smile size={60} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Neural State Logs</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-4xl font-black">{data?.moodData?.length || 0}</h4>
                        <span className="text-amber-500 text-[10px] font-black italic uppercase">Records</span>
                    </div>
                </div>
            </div>

            {/* Main Charts area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Trend Chart */}
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={16} className="text-primary" /> Persistence Flow
                            </h3>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Deployment History</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.chartData}>
                                <defs>
                                    <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#475569"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={10}
                                    fontWeight={900}
                                    tick={{ transform: 'translate(0, 5)' }}
                                />
                                <YAxis hide domain={[0, 'dataMax + 1']} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="completions"
                                    stroke="var(--primary)"
                                    fillOpacity={1}
                                    fill="url(#colorCompletions)"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#030712', stroke: 'var(--primary)', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mood Distribution */}
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Smile size={16} className="text-secondary" /> Neural State Correlation
                            </h3>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Sentiment Matrix</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.moodData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="mood"
                                    stroke="#475569"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={10}
                                    fontWeight={900}
                                    tickFormatter={(val) => val.toUpperCase()}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 900 }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                    {data?.moodData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={moodColors[entry.mood] || '#8884d8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Smart Detection Banner */}
            <div className="glass-card bg-primary/5 border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white neo-glow-primary shrink-0">
                        <Shield size={32} />
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Strategy Insight</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-black italic">Priority Alpha</span>
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight">Peak Performance Window Detected</h4>
                        <p className="text-slate-400 font-medium text-sm mt-1">
                            Operational data indicates maximum efficiency on <span className="text-white font-bold tracking-widest uppercase italic">{data?.chartData?.sort((a, b) => b.completions - a.completions)[0]?.name || 'scheduled cycle'}s</span>. Recommend intensifying effort during this window.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <button 
                            onClick={() => navigate('/goals')}
                            className="btn-primary !px-6 !py-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest group"
                        >
                            ADOPT PROTOCOL
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
