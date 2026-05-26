import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { 
  FilePlus, 
  Send, 
  CheckCircle, 
  Hash, 
  Link as LinkIcon,
  Copy,
  Plus
} from 'lucide-react';

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    universityName: 'Global Tech University',
    courseName: '',
    degreeName: '',
    studentEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await api.post('/certificates/issue', formData);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-dark min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Issue Credential</h1>
          <p className="text-gray-400">Mint a new permanent certificate onto the blockchain.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.form 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit} 
            className="glass p-8 rounded-3xl space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Student Name</label>
                <input 
                  type="text" 
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 focus:border-accent outline-none"
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Student ID</label>
                <input 
                  type="text" 
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 focus:border-accent outline-none"
                  placeholder="GTU-2026-X1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Student Email</label>
              <input 
                type="email" 
                value={formData.studentEmail}
                onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 focus:border-accent outline-none"
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Degree / Program Name</label>
              <input 
                type="text" 
                value={formData.degreeName}
                onChange={(e) => setFormData({...formData, degreeName: e.target.value})}
                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 focus:border-accent outline-none"
                placeholder="Bachelor of Science in Blockchain Technology"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Specialization / Course</label>
              <input 
                type="text" 
                value={formData.courseName}
                onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 focus:border-accent outline-none"
                placeholder="Smart Contract Security"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent hover:opacity-90 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Plus size={20} />
              <span>{loading ? 'Minting on Blockchain...' : 'Issue Certificate'}</span>
            </button>
          </motion.form>

          <div className="space-y-6">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-3xl border-2 border-green-500/20"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Successfully Issued</h3>
                    <p className="text-gray-400 text-sm">Certificate is now on-chain</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <ResultItem label="Certificate Hash" value={result.certificate.certificateHash} />
                  <ResultItem label="Transaction" value={result.certificate.transactionHash} />
                  
                  <div className="pt-6 mt-6 border-t border-white/5 flex flex-col items-center">
                    <p className="text-sm font-bold text-gray-400 mb-4 uppercase">Verification QR</p>
                    <div className="p-4 bg-white rounded-2xl">
                      <img src={result.qrCode} alt="Scan to verify this credential" className="w-[150px] h-[150px]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full glass rounded-3xl border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center p-10">
                <FilePlus className="w-16 h-16 text-white/10 mb-6" />
                <h3 className="text-xl font-bold text-white/30">Confirmation View</h3>
                <p className="text-white/20 mt-2">Minted certificate details will appear here after issuance.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ResultItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
    <div className="flex items-center justify-between bg-dark/50 p-3 rounded-xl border border-white/5">
      <code className="text-xs text-accent truncate max-w-[250px]">{value}</code>
      <button onClick={() => navigator.clipboard.writeText(value)} className="text-gray-500 hover:text-white">
        <Copy size={14} />
      </button>
    </div>
  </div>
);

export default IssueCertificate;
