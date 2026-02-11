import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiTarget, FiCode, FiBriefcase, FiUser, FiLogOut, FiMenu, FiX, FiLayers, FiTrendingUp, FiAward, FiShield, FiFileText, FiMessageSquare, FiBook, FiUsers, FiMessageCircle
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';
import QuickActionFab from '../ui/QuickActionFab';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/' },
    { name: 'Topics', icon: <FiLayers />, path: '/topics' },
    { name: 'DSA Tracker', icon: <FiCode />, path: '/problems' },
    { name: 'Leaderboard', icon: <FiTrendingUp />, path: '/leaderboard' },
    { name: 'Resources', icon: <FiBook />, path: '/resources' },
    { name: 'Mentorship', icon: <FiUsers />, path: '/mentorship' },
    { name: 'Community', icon: <FiMessageCircle />, path: '/forum' },
    { name: 'Projects', icon: <FiBriefcase />, path: '/projects' },
    { name: 'Resume AI', icon: <FiFileText />, path: '/resume' },
    { name: 'Mock Interviews', icon: <FiMessageSquare />, path: '/interviews' },
    { name: 'Companies', icon: <FiTarget />, path: '/companies' },
    { name: 'Profile', icon: <FiUser />, path: '/profile' },
  ];

  const adminItems = [
    { name: 'Admin Dashboard', icon: <FiShield />, path: '/admin' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary/30 selection:text-white">
      {/* Sidebar for Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 hidden md:flex flex-col bg-slate-900/50 backdrop-blur-xl border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-white">PlacementPro</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}

          {(user?.role === 'admin' || user?.role === 'mentor') && (
            <div className="pt-6 mt-6 border-t border-slate-800">
              <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Tools</p>
              {adminItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                      isActive 
                        ? 'bg-accent/10 text-accent border border-accent/20 shadow-lg shadow-accent/5' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed inset-x-0 top-0 z-40 h-16 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 flex items-center justify-between px-4">
        <span className="font-display font-bold text-lg text-white">PlacementPro</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-200 text-2xl">
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-30 pt-20 bg-slate-950/95 backdrop-blur-xl md:hidden p-4"
        >
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-slate-400'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            {(user?.role === 'admin' || user?.role === 'mentor') && (
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg ${
                      location.pathname === item.path
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-4 w-full rounded-xl text-red-400 mt-8 border border-red-500/20"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </nav>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pt-20 md:pt-0 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <QuickActionFab />
    </div>
  );
};

export default Layout;
