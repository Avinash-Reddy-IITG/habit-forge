import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const BadgeUnlockModal = ({ badge, onClose }) => {
    useEffect(() => {
        if (badge) {
            // Trigger confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
    }, [badge]);

    if (!badge) return null;

    const rarityStyles = {
        Legendary: 'from-purple-600 via-pink-600 to-orange-600 shadow-purple-500/50',
        Epic: 'from-blue-600 via-indigo-600 to-primary shadow-blue-500/50',
        Rare: 'from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-500/50',
        Common: 'from-gray-700 via-gray-600 to-gray-500 shadow-gray-500/50'
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    className={`relative w-full max-w-md p-1 bg-gradient-to-br ${rarityStyles[badge.type] || rarityStyles.Common} rounded-[40px] shadow-2xl overflow-hidden`}
                >
                    <div className="bg-surface rounded-[39px] p-8 text-center space-y-6">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <motion.div
                            animate={{
                                rotateY: [0, 360],
                                y: [0, -10, 0]
                            }}
                            transition={{
                                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="w-32 h-32 mx-auto bg-background rounded-full flex items-center justify-center border-4 border-white/10 shadow-inner p-4"
                        >
                            <Award className={`w-16 h-16 ${badge.type === 'Legendary' ? 'text-yellow-400' :
                                    badge.type === 'Epic' ? 'text-blue-400' :
                                        badge.type === 'Rare' ? 'text-emerald-400' :
                                            'text-gray-400'
                                }`} />
                        </motion.div>

                        <div className="space-y-2">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-sm"
                            >
                                <Sparkles size={16} /> Mastery Unlocked <Sparkles size={16} />
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl font-black italic tracking-tighter"
                            >
                                {badge.type} EARNED
                            </motion.h2>
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/5 p-4 rounded-2xl border border-white/5"
                        >
                            <p className="text-gray-300 font-medium italic">"{badge.description}"</p>
                        </motion.div>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={onClose}
                            className={`w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r ${rarityStyles[badge.type] || rarityStyles.Common}`}
                        >
                            Claim Destiny
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BadgeUnlockModal;
