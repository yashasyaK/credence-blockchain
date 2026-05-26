import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Search,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex bg-dark min-h-screen text-accent italic">Loading metrics...</div>;

  return (
    <div className="flex bg-dark min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Network Analytics</h1>
          <p className="text-gray-400">Global verification metrics and system performance.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <MetricCard title="Total Certificates" value={stats.metrics.issued} icon={<Award />} color="accent" />
           <MetricCard title="Active Network" value={stats.metrics.active} icon={<Users />} color="secondary" />
           <MetricCard title="Verification Requests" value={stats.metrics.verifications} icon={<TrendingUp />} color="green-500" />
        </div>

        <div className="glass p-10 rounded-3xl mb-10">
          <h3 className="text-2xl font-bold mb-8">Verification Health</h3>
          <div className="flex flex-col md:flex-row items-center justify-around gap-10 text-center">
            <HealthRing label="Valid" percent={stats.metrics.verifications ? (stats.metrics.validVerifications / stats.metrics.verifications * 100).toFixed(1) : 0} color="#22c55e" />
            <HealthRing label="Revoked" percent={stats.metrics.verifications ? (stats.metrics.revoked / stats.metrics.verifications * 100).toFixed(1) : 0} color="#eab308" />
            <HealthRing label="Failed/Fake" percent={stats.metrics.verifications ? ((stats.metrics.verifications - stats.metrics.validVerifications - stats.metrics.revoked) / stats.metrics.verifications * 100).toFixed(1) : 0} color="#ef4444" />
          </div>
        </div>
      </main>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }) => (
  <div className="glass p-8 rounded-3xl">
    <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-${color}`}>
      {icon}
    </div>
    <p className="text-gray-500 font-bold uppercase text-xs mb-2 tracking-widest">{title}</p>
    <h2 className="text-5xl font-bold">{value}</h2>
  </div>
);

const HealthRing = ({ label, percent, color }) => (
  <div className="space-y-4">
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
        <circle cx="64" cy="64" r="58" stroke={color} strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * percent / 100)} className="transition-all duration-1000" />
      </svg>
      <span className="absolute text-2xl font-bold">{percent}%</span>
    </div>
    <span className="block font-bold text-gray-400">{label}</span>
  </div>
);

export default AdminStats;
