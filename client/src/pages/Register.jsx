import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-2xl w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-secondary">Enlist in HabitForge</h2>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-surface/50 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-secondary transition-colors"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="HabitMaster99"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-surface/50 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-secondary transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full bg-surface/50 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-secondary transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-secondary hover:bg-teal-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-secondary/25 transition-all mt-4 hover:-translate-y-0.5"
                    >
                        Enlist Now
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Already have an account? <Link to="/login" className="text-secondary hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
