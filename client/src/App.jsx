import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import GoalDetail from './pages/GoalDetail';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import PublicProfile from './pages/PublicProfile';
import BadgeHistory from './pages/BadgeHistory';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

// Home (Landing) Page
const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-20 relative">
            <div className="absolute top-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full -z-10"></div>

            <h2 className="text-5xl font-extrabold mb-6 tracking-tight">Level Up Your Life</h2>
            <p className="text-gray-400 mb-10 max-w-lg text-center text-lg">
                Track your habits, build massive streaks, and earn epic gamified badges along your journey to self-mastery.
            </p>
            <div className="glass p-10 rounded-3xl w-full max-w-2xl text-center border-t border-gray-700/50">
                <p className="font-semibold text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Ready to reforge your destiny?
                </p>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="goals" element={
                            <ProtectedRoute>
                                <Goals />
                            </ProtectedRoute>
                        } />
                        <Route path="goals/:id" element={
                            <ProtectedRoute>
                                <GoalDetail />
                            </ProtectedRoute>
                        } />
                        <Route path="analytics" element={
                            <ProtectedRoute>
                                <Analytics />
                            </ProtectedRoute>
                        } />
                        <Route path="leaderboard" element={
                            <ProtectedRoute>
                                <Leaderboard />
                            </ProtectedRoute>
                        } />
                        <Route path="profile/:username" element={
                            <ProtectedRoute>
                                <PublicProfile />
                            </ProtectedRoute>
                        } />
                        <Route path="badges" element={
                            <ProtectedRoute>
                                <BadgeHistory />
                            </ProtectedRoute>
                        } />
                        <Route path="admin" element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        } />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
