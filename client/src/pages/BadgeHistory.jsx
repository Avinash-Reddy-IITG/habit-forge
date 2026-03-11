import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Award, Calendar, ShieldCheck, Zap, History, Star } from 'lucide-react';
import { format } from 'date-fns';

const BadgeHistory = () => {
    const { user } = useAuth();
    const badges = user?.badges || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20 max-w-5xl mx-auto"
        >
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-400">
                        <History size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Merit Archives</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-gradient uppercase italic">Legacy Timeline</h2>
                    <p className="text-slate-400 font-medium text-lg italic">"A record of unbroken discipline and achieved mastery."</p>
                </div>
                <div className="stat-card !p-6 flex items-center gap-6 bg-indigo-500/5 border-indigo-500/20">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 neo-glow-primary">
                        <Award size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Merits</p>
                        <p className="text-4xl font-black text-white tracking-tighter">{badges.length}</p>
                    </div>
                </div>
            </header>

            <div className="relative border-l-2 border-slate-800/50 ml-6 md:ml-32 space-y-16 py-8">
                {badges.length === 0 ? (
                    <div className="glass-card !p-20 text-center border-dashed border-white/10 ml-12">
                        <History size={64} className="mx-auto text-slate-800 mb-6 opacity-30" />
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-600">No Archives Found</h3>
                        <p className="text-[10px] font-bold text-slate-700 uppercase mt-4 tracking-widest">Your journey of mastery begins with a single habit.</p>
                    </div>
                ) : (
                    badges.slice().reverse().map((badge, index) => {
                        const isLegendary = badge.type === 'Legendary';
                        const isEpic = badge.type === 'Epic';
                        const badgeColor = isLegendary ? 'text-yellow-500' : isEpic ? 'text-indigo-400' : 'text-sky-400';
                        const glowStyle = isLegendary ? 'rgba(234,179,8,0.2)' : isEpic ? 'rgba(79,70,229,0.2)' : 'rgba(14,165,233,0.2)';

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="relative ml-12 md:ml-20 group"
                            >
                                {/* Timeline Connector */}
                                <div className="absolute -left-[67px] md:-left-[91px] top-12 w-12 h-0.5 bg-slate-800/50 group-hover:bg-indigo-500 transition-colors" />
                                <div className="absolute -left-[71px] md:-left-[95px] top-11 w-2.5 h-2.5 bg-slate-900 border-2 border-slate-700 rounded-full z-10 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all scale-125" />

                                <div className={`glass-card !p-10 flex flex-col md:flex-row gap-10 items-center md:items-start group-hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent`}>
                                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none group-hover:scale-110 duration-700">
                                        <Award size={150} />
                                    </div>

                                    <div className={`w-36 h-36 shrink-0 rounded-[32px] flex items-center justify-center border-2 glass border-white/5 shadow-2xl group-hover:scale-105 transition-transform duration-700 relative z-10`}>
                                        <div className={`absolute inset-0 rounded-[30px] opacity-10`} style={{ backgroundColor: badgeColor.split('-')[1] }} />
                                        <Award size={64} className={`${badgeColor} drop-shadow-[0_0_15px_${glowStyle}] transition-all duration-500`} />
                                    </div>

                                    <div className="flex-grow space-y-6 text-center md:text-left relative z-10">
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${badgeColor}`}>{badge.type} CLASSIFICATION</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Hall of Forge</span>
                                                </div>
                                                <h4 className="text-4xl font-black uppercase tracking-tighter italic leading-none group-hover:text-indigo-400 transition-colors">Merit Archived</h4>
                                            </div>
                                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900/50 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-xl">
                                                <Calendar size={14} className="text-indigo-500" /> {format(new Date(badge.earnedAt), 'MMMM dd, yyyy').toUpperCase()}
                                            </div>
                                        </div>

                                        <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
                                            "{badge.description}"
                                        </p>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4 border-t border-white/5 w-fit mx-auto md:mx-0 pr-8">
                                            <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">
                                                <Zap size={14} className="fill-current" /> Mastery Link Confirmed
                                            </div>
                                            <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <ShieldCheck size={14} /> Neural Entry Verified
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Final Timeline Mark */}
            <div className="text-center pt-20">
                <div className="w-1 h-20 bg-gradient-to-b from-slate-800 to-transparent mx-auto" />
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] mt-8 leading-loose">
                    THE ARCHIVE CONTINUES<br />
                    STAY RELENTLESS
                </p>
            </div>
        </motion.div>
    );
};

export default BadgeHistory;
