import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const IssueCertificate = lazy(() => import('./pages/IssueCertificate'));
const AdminStats = lazy(() => import('./pages/AdminStats'));
const VerificationLogs = lazy(() => import('./pages/VerificationLogs'));

function App() {
  return (
    <div className="min-h-screen bg-dark overflow-hidden">
      <Suspense fallback={<div className="h-screen grid place-items-center text-accent">Loading Credence...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/issue" element={<ProtectedRoute><IssueCertificate /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminStats /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><VerificationLogs /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
