import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../store/analyticsSlice';
import { Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Activity, Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';

const COLORS = ['#f97316', '#eab308', '#10b981', '#f43f5e', '#8b5cf6'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.analytics);
  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (role && String(role).toUpperCase() !== 'CITIZEN') {
      dispatch(fetchAnalytics());
    }
  }, [dispatch, role]);

  if (role && String(role).toUpperCase() === 'CITIZEN') {
    return <Navigate to="/dashboard" replace />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GlassCard className="max-w-md w-full border-red-500/20 bg-red-500/5">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Analytics</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {typeof error === 'string' ? error : error?.message || error?.error || 'An unexpected error occurred.'}
          </p>
        </GlassCard>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400 animate-pulse font-medium">Crunching the numbers...</p>
        </div>
      </div>
    );
  }

  const statusData = Object.keys(data.complaintsByStatus || {}).map(key => ({
    name: key,
    value: data.complaintsByStatus[key]
  }));

  const categoryData = Object.keys(data.complaintsByCategory || {}).map(key => ({
    name: key,
    value: data.complaintsByCategory[key]
  }));

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl shadow-lg shadow-orange-500/20">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 dark:text-slate-400 mt-1">System-wide performance and metrics overview.</motion.p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Total Complaints', value: data.totalComplaints, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Resolved', value: data.resolvedComplaints, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Avg Resolution', value: data.averageResolutionTimeHours ? `${Math.round(data.averageResolutionTimeHours)}h` : 'N/A', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={itemVariants} className="h-full">
            <GlassCard hoverEffect={true} delay={i * 0.1}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <motion.h4 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1), type: "spring" }}
                    className="text-4xl font-black text-slate-900 dark:text-white mt-3 font-outfit tracking-tight"
                  >
                    {stat.value}
                  </motion.h4>
                </div>
                <div className={`rounded-2xl p-4 ${stat.bg}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="h-full">
          <GlassCard className="h-full p-6" hoverEffect={true}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Complaints by Status</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <GlassCard className="h-full p-6" hoverEffect={true}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Complaints by Category</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" className="text-slate-400" tick={{ fill: 'currentColor' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="currentColor" className="text-slate-400" tick={{ fill: 'currentColor' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
