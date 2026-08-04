+import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../store/notificationSlice';
import { Bell, Clock, Info, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { list: notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getIconInfo = (type, message) => {
    const msgLower = (message || '').toLowerCase();
    let computedType = type || 'INFO';
    
    if (msgLower.includes('resolved') || msgLower.includes('accepted')) computedType = 'SUCCESS';
    if (msgLower.includes('rejected') || msgLower.includes('error')) computedType = 'WARNING';

    switch (computedType) {
      case 'SUCCESS': return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', glow: 'shadow-emerald-500/20' };
      case 'WARNING': return { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', glow: 'shadow-orange-500/20' };
      case 'INFO':
      default: return { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', glow: 'shadow-blue-500/20' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-12 mt-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-50 animate-pulse" />
            <div className="relative p-4 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl border border-white/10 shadow-xl">
              <Bell className="h-7 w-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">Notification Center</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Stay updated on your complaints and system events
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent hidden sm:block z-0" />

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Syncing updates...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard className="text-center py-24 text-slate-500 border-dashed border-2 border-slate-300 dark:border-slate-700 bg-white/5 dark:bg-slate-900/20">
              <div className="inline-flex p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                <Bell className="h-12 w-12 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit mb-2">All Caught Up!</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">You have no new notifications right now.</p>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="space-y-6 sm:pl-16 relative z-10">
            <AnimatePresence>
              {notifications.map((notification, index) => {
                const { icon: Icon, color, bg, glow } = getIconInfo(notification.type, notification.message);
                const isNew = index === 0;

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    key={notification.id}
                    className="relative group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 hidden sm:block shadow-[0_0_10px_rgba(99,102,241,0.5)] z-20" />

                    <GlassCard 
                      hoverEffect={true} 
                      className={`relative p-0 overflow-hidden transition-all duration-300 ${isNew ? 'border-indigo-500/30 dark:border-indigo-500/40 shadow-lg shadow-indigo-500/10' : 'border-slate-200 dark:border-white/5'} hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/20 group-hover:-translate-y-1`}
                    >
                      {isNew && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-full pointer-events-none" />
                      )}
                      
                      <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center relative z-10">
                        <div className={`shrink-0 rounded-2xl p-3.5 border ${bg} shadow-lg ${glow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <Icon className={`h-6 w-6 ${color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                            <h3 className={`text-lg sm:text-xl font-bold font-outfit truncate pr-4 ${isNew ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>
                              {notification.title || 'System Update'}
                            </h3>
                            <span className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full w-fit shrink-0 border border-slate-200 dark:border-slate-700/50">
                              <Clock className="mr-1.5 h-3.5 w-3.5" />
                              {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {notification.message}
                          </p>
                        </div>

                        {isNew && (
                          <div className="absolute top-6 right-6 flex h-3 w-3 sm:hidden">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
