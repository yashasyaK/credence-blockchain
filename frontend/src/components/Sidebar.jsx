import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileCheck, 
  PlusCircle, 
  BarChart3, 
  History, 
  LogOut, 
  Shield 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'university', 'recruiter', 'student'] },
    { icon: <FileCheck size={20} />, label: 'Verify', path: '/verify', roles: ['admin', 'university', 'recruiter', 'student'] },
    { icon: <PlusCircle size={20} />, label: 'Issue', path: '/issue', roles: ['admin', 'university'] },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin', roles: ['admin', 'university'] },
    { icon: <History size={20} />, label: 'Logs', path: '/logs', roles: ['admin', 'university'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="w-64 h-screen glass border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <Shield className="text-accent w-8 h-8" />
        <span className="text-xl font-bold gradient-text">Credence</span>
      </div>

      <nav className="flex-1 space-y-2">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-accent/20 text-accent border border-accent/20' 
                : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center space-x-3 px-4 py-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-secondary flex items-center justify-center font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold truncate max-w-[120px]">{user?.name}</span>
            <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
