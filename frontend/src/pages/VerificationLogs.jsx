import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { 
  History, 
  ShieldCheck, 
  ShieldX, 
  Clock,
  User,
  ArrowUpRight
} from 'lucide-react';

const VerificationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setLogs(res.data.data.recentVerifications))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex bg-dark min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Audit Logs</h1>
            <p className="text-gray-400">Full history of verification attempts across the network.</p>
          </div>
          <div className="flex items-center space-x-2 text-accent bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Real-time Feed</span>
          </div>
        </header>

        <div className="glass rounded-3xl overflow-hidden border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Verifier</th>
                <th className="px-8 py-5">Hash</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">System Risk</th>
                <th className="px-8 py-5">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <span className="font-medium">{log.verifierName || 'System'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-accent/70">
                    {log.certificateHash.slice(0, 16)}...
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      log.verificationStatus === 'VALID' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {log.verificationStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <span className="text-sm font-bold">{log.aiRisk?.riskScore || 0}%</span>
                       <div className="w-16 h-1 px-[1px] bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${log.aiRisk?.riskScore > 50 ? 'bg-red-500' : 'bg-accent'}`} style={{ width: `${log.aiRisk?.riskScore || 0}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500 text-sm">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && logs.length === 0 && (
            <div className="p-20 text-center text-gray-600 italic">No verification records found.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerificationLogs;
