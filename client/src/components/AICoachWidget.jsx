import React from 'react';
import { Sparkles, BrainCircuit, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const AICoachWidget = ({ tip }) => {
    if (!tip) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden group"
        >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-colors"></div>

            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-xl">
                    <BrainCircuit className="text-primary w-5 h-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">AI Strategy Coach</h3>
                <Sparkles className="text-accent w-4 h-4 animate-pulse" />
            </div>

            <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 -z-10" />
                <p className="text-gray-300 text-sm italic leading-relaxed pl-4 border-l-2 border-primary/30">
                    "{tip}"
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Personalized Insight Gen v3.0</span>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AICoachWidget;
