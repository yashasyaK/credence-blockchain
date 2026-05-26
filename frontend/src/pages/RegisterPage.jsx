import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Shield, Briefcase } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-dark z-0">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-10 rounded-3xl z-10 relative"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="text-secondary w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">Join Credence</h2>
          <p className="text-gray-400 mt-2">Secure your digital identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-secondary outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-secondary outline-none transition-all"
                placeholder="john@example.com"
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-secondary outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Organization (optional)</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-secondary outline-none transition-all"
                placeholder="University or employer"
              />
            </div>
            <p className="text-xs text-gray-500">Issuer permissions are approved by a platform administrator.</p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-secondary hover:opacity-90 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all mt-4"
          >
            <UserPlus size={20} />
            <span>Create Account</span>
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-secondary font-semibold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
