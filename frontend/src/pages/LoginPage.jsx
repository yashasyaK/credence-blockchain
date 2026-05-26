import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Shield } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-dark z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-10 rounded-3xl z-10 relative"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="text-accent w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to manage credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all"
                placeholder="admin@university.edu"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-accent hover:opacity-90 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <LogIn size={20} />
            <span>Sign In</span>
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Don't have an account? <Link to="/register" className="text-accent font-semibold hover:underline">Register Now</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
