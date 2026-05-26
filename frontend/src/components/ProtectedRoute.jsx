import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-dark text-accent">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
