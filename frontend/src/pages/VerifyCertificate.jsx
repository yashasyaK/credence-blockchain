import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  ShieldX, 
  AlertCircle, 
  Cpu, 
  ExternalLink,
  Clipboard
} from 'lucide-react';

const VerifyCertificate = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [hash, setHash] = useState(searchParams.get('hash') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    
    try {
      const res = await api.post('/verify/hash', { 
        certificateHash: hash,
        verifierName: "Demo Verifier",
        verifierEmail: "demo@verifier.com"
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-dark min-h-screen">
      {isAuthenticated ? <Sidebar /> : (
        <Link to="/" className="fixed top-8 left-8 z-20 text-xl font-bold gradient-text">Credence</Link>
      )}
      <main className={`flex-1 p-6 md:p-10 ${isAuthenticated ? 'md:ml-64' : 'max-w-5xl mx-auto pt-28'}`}>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Verify Credential</h1>
          <p className="text-gray-400">Public, instant validation of any on-chain credential hash.</p>
        </header>

        <div className="max-w-4xl">
          <form onSubmit={handleVerify} className="glass p-8 rounded-3xl mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="w-full bg-dark/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-accent outline-none transition-all"
                  placeholder="Paste a credential hash or issued reference"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-accent hover:opacity-90 px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Now'}
              </button>
            </div>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl mb-10 flex items-center space-x-4">
              <ShieldX className="text-red-500" />
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Result Card */}
                <div className={`glass p-10 rounded-3xl border-2 ${
                  result.verificationStatus === 'VALID' ? 'border-green-500/30' : 
                  result.verificationStatus === 'REVOKED' ? 'border-yellow-500/30' : 'border-red-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      {result.verificationStatus === 'VALID' ? (
                        <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                          <ShieldCheck className="text-green-500 w-8 h-8" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                          <ShieldX className="text-red-500 w-8 h-8" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-3xl font-bold">{result.verificationStatus}</h2>
                        <p className="text-gray-400">Blockchain Status Response</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-2 text-accent mb-1">
                        <Cpu size={16} />
                        <span className="text-xs font-bold uppercase">AI Risk Score</span>
                      </div>
                      <div className="text-4xl font-mono font-bold">{result.aiRisk.riskScore}%</div>
                      <div className={`text-xs font-bold uppercase mt-1 ${
                        result.aiRisk.status === 'LOW_RISK' ? 'text-green-500' : 'text-red-500'
                      }`}>{result.aiRisk.status.replace('_', ' ')}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Certificate Data</h4>
                      <div className="space-y-3">
                        <DataRow label="Student ID" value={result.blockchainResult.studentId || "N/A"} />
                        <DataRow label="University" value={result.blockchainResult.universityName || result.certificate?.universityName || "N/A"} />
                        <DataRow label="Course" value={result.blockchainResult.courseName || result.certificate?.courseName || "N/A"} />
                        <DataRow label="Issued At" value={result.blockchainResult.issuedAt ? new Date(result.blockchainResult.issuedAt * 1000).toLocaleDateString() : "N/A"} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">On-Chain Metadata</h4>
                      <div className="space-y-3">
                        <DataRow label="Issuer" value={result.blockchainResult.issuer || "N/A"} />
                        <DataRow label="Transaction" value={result.certificate?.blockchainTxHash ? `${result.certificate.blockchainTxHash.slice(0, 10)}...` : "N/A"} />
                        <div className="pt-2">
                           <p className="text-xs text-gray-500 mb-2">AI Reasons:</p>
                           <ul className="space-y-1">
                             {result.aiRisk.reasons.map((r, i) => (
                               <li key={i} className="text-xs text-yellow-500 flex items-center space-x-1">
                                 <AlertCircle size={10} />
                                 <span>{r}</span>
                               </li>
                             ))}
                           </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const DataRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium truncate ml-4 text-right max-w-[200px]" title={value}>{value}</span>
  </div>
);

export default VerifyCertificate;
