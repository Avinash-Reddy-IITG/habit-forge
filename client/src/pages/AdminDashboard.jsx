import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Target, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8"
        >
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20 neo-glow-secondary">
                    <ShieldAlert className="w-6 h-6 fill-current" />
                </div>
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-gradient">Admin Command</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">System-wide performance aggregated metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <motion.div whileHover={{ y: -5 }} className="glass-card flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 relative z-10">
                        <Users className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p className="text-6xl font-black tracking-tighter text-white mb-2 relative z-10">{stats?.totalUsers || 0}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] relative z-10">Total Enlisted</p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 relative z-10">
                        <Target className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="text-6xl font-black tracking-tighter text-white mb-2 relative z-10">{stats?.totalGoals || 0}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] relative z-10">Active Quests</p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 relative z-10">
                        <Activity className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="text-6xl font-black tracking-tighter text-white mb-2 relative z-10 flex items-baseline justify-center gap-1">
                        {stats?.systemProductivity || 0}<span className="text-amber-500 text-xl">%</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] relative z-10">Global Mastery</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
