import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut, Home, Target, LayoutDashboard,
    BarChart3, Trophy, Settings, Bell,
    Search, Menu, X, User as UserIcon,
    Zap, Award, Flame, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`sidebar-item relative overflow-hidden group ${active ? 'active' : ''}`}
    >
        {active && <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full" />}
        <Icon size={20} className={active ? "text-primary drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]" : "text-slate-500 group-hover:text-white transition-colors"} />
        <span className={`font-bold tracking-wide ${active ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}`}>{label}</span>
    </Link>
);

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 120000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error) {
            console.error("Error marking read:", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/goals', icon: Target, label: 'Quests' },
        { to: '/analytics', icon: BarChart3, label: 'Strategic Analysis' },
        { to: '/leaderboard', icon: Trophy, label: 'Hall of Heroes' },
    ];

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30 flex overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-[70] w-64 glass border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center neo-glow-primary">
                            <Zap className="text-white fill-current" size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-gradient">
                            HabitForge
                        </h1>
                    </div>

                    {user ? (
                        <nav className="flex-grow space-y-2">
                            {navItems.map((item) => (
                                <SidebarItem
                                    key={item.to}
                                    to={item.to}
                                    icon={item.icon}
                                    label={item.label}
                                    active={isActive(item.to)}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            ))}
                        </nav>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <UserIcon size={32} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500 text-sm mb-6">Join the pursuit of greatness.</p>
                            <Link to="/login" className="btn-primary w-full text-center">Get Started</Link>
                        </div>
                    )}

                    <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        )}
                        <SidebarItem
                            to="/"
                            icon={Home}
                            label="Home Page"
                            active={isActive('/')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto">
                {/* Top Bar */}
                <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="hidden md:flex items-center gap-3 glass border-white/5 bg-white/5 !px-3 !py-2 rounded-xl w-64 transition-all focus-within:ring-1 ring-primary/50">
                            <Search size={18} className="text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search quests..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <div className="hidden sm:flex gap-4 mr-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold neo-glow-secondary">
                                        <Flame size={14} className="fill-current" />
                                        12 DAYS
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                                        <Award size={14} />
                                        LVL 4
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2.5 rounded-xl hover:bg-white/5 relative text-slate-400 transition-colors"
                                    >
                                        <Bell size={20} />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border border-slate-900 animate-pulse"></span>
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-80 glass rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                                            >
                                                <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                                                    <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">Battle Intel</h4>
                                                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{notifications.length} NEW</span>
                                                </div>
                                                <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-8 text-center text-xs text-slate-500">No new messages from headquarters.</div>
                                                    ) : (
                                                        notifications.map(n => (
                                                            <div key={n._id} className="p-4 hover:bg-white/5 transition-colors group">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <p className="font-bold text-xs text-white uppercase tracking-tight">{n.title}</p>
                                                                    <button onClick={() => markRead(n._id)} className="text-slate-600 hover:text-emerald-400 transition-colors">
                                                                        <Check size={14} />
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs text-slate-400 leading-relaxed mb-1">{n.message}</p>
                                                                <p className="text-[10px] text-slate-600 font-medium">
                                                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-white">{user.username}</p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-tighter">Elite Member</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl glass border-white/10 overflow-hidden p-0.5">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.username}&background=4f46e5&color=fff&bold=true`}
                                            alt="avatar"
                                            className="w-full h-full rounded-[10px]"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex gap-3 items-center">
                                <Link to="/login" className="btn-outline !py-2 !px-4 text-xs font-black uppercase tracking-widest">Login</Link>
                                <Link to="/register" className="btn-primary !py-2 !px-4 text-xs font-black uppercase tracking-widest">Register</Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-6 lg:p-8 max-w-[1600px] w-full mx-auto flex-grow">
                    <Outlet />
                </main>

                <footer className="px-8 py-6 text-center text-slate-600 text-[11px] font-bold uppercase tracking-widest border-t border-white/5">
                    &copy; {new Date().getFullYear()} HabitForge: Mastery Journey. Stay relentless.
                </footer>
            </div>
        </div>
    );
};

export default Layout;
