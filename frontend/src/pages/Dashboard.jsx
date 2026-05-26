import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'university') {
      api.get('/admin/dashboard')
        .then((response) => setMetrics(response.data.data.metrics))
        .catch(() => setMetrics(null));
    }
  }, [user?.role]);

  return (
    <div className="flex bg-dark min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold mb-2"
          >
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </motion.h1>
          <p className="text-gray-400">Here's what's happening with your credentials today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard label="Issued" value={metrics?.issued ?? '--'} icon={<FileText className="text-accent" />} />
          <StatsCard label="Verified Valid" value={metrics?.validVerifications ?? '--'} icon={<ShieldCheck className="text-green-500" />} />
          <StatsCard label="Revoked" value={metrics?.revoked ?? '--'} icon={<AlertTriangle className="text-yellow-500" />} />
          <StatsCard label="Checks Run" value={metrics?.verifications ?? '--'} icon={<Zap className="text-secondary" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="glass p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionCard 
                  title="Verify Hash" 
                  desc="Instantly check any certificate hash on-chain."
                  to="/verify"
                  icon={<ShieldCheck className="text-accent" />}
                />
                {(user?.role === 'admin' || user?.role === 'university') && (
                  <ActionCard 
                    title="Issue New" 
                    desc="Generate and sign a new blockchain credential."
                    to="/issue"
                    icon={<FileText className="text-secondary" />}
                  />
                )}
              </div>
            </section>
          </div>

          <aside className="glass p-8 rounded-3xl h-fit">
            <h3 className="text-xl font-bold mb-6">System Health</h3>
            <div className="space-y-6">
              <HealthItem label="Blockchain Node" status="Operational" online={true} />
              <HealthItem label="MongoDB Cluster" status="Operational" online={true} />
              <HealthItem label="AI Scorer" status="Operational" online={true} />
              <HealthItem label="Smart Contract" status="Live" online={true} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const StatsCard = ({ label, value, icon }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="glass p-6 rounded-2xl flex items-center justify-between"
  >
    <div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center p-3`}>
      {icon}
    </div>
  </motion.div>
);

const ActionCard = ({ title, desc, to, icon }) => (
  <Link to={to} className="group p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 flex items-start space-x-4">
    <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-lg group-hover:text-accent transition-colors">{title}</h4>
      <p className="text-gray-400 text-sm mt-1">{desc}</p>
    </div>
  </Link>
);

const HealthItem = ({ label, status, online }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-400 text-sm">{label}</span>
    <div className="flex items-center space-x-2">
      <span className="text-xs font-semibold uppercase">{status}</span>
      <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
    </div>
  </div>
);

export default Dashboard;
