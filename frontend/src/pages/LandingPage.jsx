import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Database, Cpu, ArrowRight } from 'lucide-react';
import BlockchainScene from '../scenes/BlockchainScene';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-dark">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <BlockchainScene />
        </Canvas>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 w-full">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 py-6 glass sticky top-0">
          <div className="flex items-center space-x-2">
            <Shield className="text-accent w-8 h-8" />
            <span className="text-2xl font-bold gradient-text">Credence</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/login" className="text-sm font-medium hover:text-accent transition-colors">Login</Link>
            <Link to="/register" className="px-6 py-2 bg-accent/20 border border-accent/30 rounded-full text-accent hover:bg-accent/30 transition-all font-semibold">Join Project</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left max-w-3xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6">
              The Future of <span className="gradient-text">Verification</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Decentralized, tamper-proof, and AI-powered certificate issuance and verification 
              system built on Ethereum. Ensuring academic integrity with zero compromise.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/register" className="flex items-center space-x-2 bg-accent px-8 py-4 rounded-xl text-lg font-bold hover:bg-accent/80 transition-all">
                <span>Issue Certificate</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/verify" className="bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                Verify Credential
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Database className="text-accent" />}
              title="Immutable Storage"
              description="Certificates hashes are stored on the blockchain, ensuring they can never be modified."
            />
            <FeatureCard 
              icon={<Cpu className="text-secondary" />}
              title="AI Detection"
              description="Rule-based AI analyzes tamper risks and suspicious patterns in real-time."
            />
            <FeatureCard 
              icon={<CheckCircle className="text-green-500" />}
              title="Instant Verification"
              description="Validate any credential in seconds with cryptographic certainty."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 glass rounded-3xl hover:border-accent/30 transition-all cursor-pointer"
  >
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default LandingPage;
