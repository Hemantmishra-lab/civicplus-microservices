import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { LogOut, LayoutDashboard, FileText, Bell, BarChart2, X, User, Search, Menu, Sun, Moon } from 'lucide-react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Spotlight } from '../components/ui/Spotlight';
import { useTheme } from '../components/ThemeProvider';

const resolveImageUrl = (url) => {
  if (!url) return '';
  // Legacy broken local container paths
  if (url.includes('localhost:8082')) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:8080${url}`;
};

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { username, role, userId, email } = useSelector((state) => state.auth);
  const [toastMessage, setToastMessage] = useState(null);
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Complaints', href: '/dashboard/complaints', icon: FileText },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    ...(role && String(role).toUpperCase() !== 'CITIZEN' ? [{ name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 }] : []),
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/api/v1/users/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS('http://localhost:8080/api/v1/notifications/ws-complaints');
    const stompClient = Stomp.over(socket);
    
    stompClient.debug = () => {};

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/status/${userId}`, (message) => {
        setToastMessage(message.body);
        setTimeout(() => setToastMessage(null), 5000);
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [userId]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-inter transition-colors duration-500 relative">
      {/* Background FX */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[100px] animate-pulse delay-700" />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4">
        <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">CivicPlus</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`
              fixed md:relative z-40 w-72 h-full flex-shrink-0 flex flex-col justify-between 
              bg-white/90 dark:bg-[#0b1021]/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/5 shadow-2xl
              ${isMobileMenuOpen ? 'left-0' : 'hidden md:flex'}
            `}
          >
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pt-16 md:pt-0">
              
              {/* Premium Profile Header */}
              <div className="relative overflow-hidden p-6 border-b border-slate-200/50 dark:border-white/5">
                <Spotlight className="absolute inset-0 opacity-50 dark:opacity-20" />
                
                {/* Theme Toggle Switch */}
                <button 
                  onClick={toggleTheme}
                  className="absolute top-4 right-4 w-12 h-6 rounded-full bg-slate-200/50 dark:bg-black/40 border border-slate-300/50 dark:border-white/10 shadow-inner flex items-center p-0.5 transition-colors z-20 hover:ring-2 ring-orange-500/30"
                  aria-label="Toggle Theme"
                >
                  <motion.div
                    initial={false}
                    animate={{ x: isDark ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-200 dark:border-slate-700"
                  >
                    {isDark ? <Moon className="w-3 h-3 text-indigo-500" /> : <Sun className="w-3 h-3 text-orange-500" />}
                  </motion.div>
                </button>
                
                <div className="relative z-10 flex flex-col items-center text-center mt-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="h-24 w-24 rounded-full p-[2px] bg-gradient-to-tr from-orange-500 via-rose-500 to-indigo-500 shadow-[0_0_20px_rgba(249,115,22,0.2)] mb-4"
                  >
                    <div className="h-full w-full rounded-full overflow-hidden bg-white dark:bg-[#0b1021] border-2 border-[#0b1021]">
                      {profile?.avatarUrl ? (
                        <img src={resolveImageUrl(profile.avatarUrl)} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-3xl font-black text-orange-500 bg-orange-500/10">
                          {profile?.firstName?.[0] || email?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                  
                  <h2 className="text-xl font-black font-outfit tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                    {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (username || 'User')}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[10px] font-black uppercase tracking-[0.15em]">
                      {role || 'CITIZEN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-5 py-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner font-medium"
                  />
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-4 space-y-2 pb-4 relative">
                {filteredNavItems.map((item) => {
                  const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`relative flex items-center px-4 py-3.5 text-sm font-bold transition-all rounded-xl z-10 group overflow-hidden ${!isActive && 'hover:bg-slate-100/50 dark:hover:bg-white/5'}`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeNavIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-rose-500/5 border border-orange-500/30 rounded-xl -z-10 shadow-[inset_0_0_20px_rgba(249,115,22,0.1)]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon className={`mr-4 h-5 w-5 shrink-0 transition-all duration-300 ${isActive ? 'text-orange-500 scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'text-slate-400 group-hover:text-orange-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`tracking-wide ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                        {item.name}
                      </span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="p-5 border-t border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-[#060b1e]/50 backdrop-blur-xl">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="relative overflow-hidden w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-transparent hover:from-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(225,29,72,0.1)] hover:shadow-[0_0_25px_rgba(225,29,72,0.2)]"
              >
                LOGOUT <LogOut className="h-4 w-4 group-hover:translate-x-1 group-hover:text-rose-500 transition-all" strokeWidth={2.5} />
                <span className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content View - Only this area scrolls, sidebar stays fixed */}
      <main data-lenis-prevent className="flex-1 flex flex-col relative z-10 min-w-0 pt-16 md:pt-0 h-full overflow-y-auto smooth-scroll-content custom-scrollbar">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              className="fixed top-6 left-1/2 z-50 flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl px-5 py-3 rounded-2xl"
            >
              <div className="bg-orange-500/20 p-2 rounded-full mr-3">
                <Bell className="w-5 h-5 text-orange-500 animate-pulse" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-white mr-6">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="p-4 md:p-8 min-h-full">
          <Outlet />
        </div>
      </main>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
}
