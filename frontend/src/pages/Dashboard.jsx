import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints, updateComplaintStatus, assignComplaint } from '../store/complaintSlice';
import NewComplaintModal from '../components/NewComplaintModal';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import { Plus, FileText, AlertCircle, CheckCircle, ExternalLink, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedButton } from '../components/ui/AnimatedButton';

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

// Premium Badges
const StatusBadge = ({ status, isDepartment }) => {
  const displayStatus = isDepartment && status === 'SUBMITTED' ? 'PENDING' : status;
  
  if (status === 'RESOLVED') {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
        {displayStatus}
      </span>
    );
  }
  if (status === 'SUBMITTED' || status === 'PENDING') {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
        {displayStatus}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
      {displayStatus}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  if (priority === 'HIGH') {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
        {priority}
      </span>
    );
  }
  if (priority === 'MEDIUM') {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] bg-amber-500/10 text-amber-500 border border-amber-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
        {priority}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] bg-blue-500/10 text-blue-400 border border-blue-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5" />
      {priority}
    </span>
  );
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list: complaints, loading } = useSelector((state) => state.complaints);
  const { role } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const pending = total - resolved;
  const isDepartment = role && String(role).toUpperCase() !== 'CITIZEN';

  const kpis = [
    { label: `Total ${isDepartment ? 'Assigned' : 'Grievances'}`, value: total, icon: FileText, color: 'text-blue-500', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]', ring: 'ring-blue-500/30', gradient: 'from-blue-500/10 to-transparent' },
    { label: 'Pending Action', value: pending, icon: AlertCircle, color: 'text-orange-500', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]', ring: 'ring-orange-500/30', gradient: 'from-orange-500/10 to-transparent' },
    { label: 'Resolved Issues', value: resolved, icon: CheckCircle, color: 'text-emerald-500', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]', ring: 'ring-emerald-500/30', gradient: 'from-emerald-500/10 to-transparent' }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 relative z-10"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <motion.h1 variants={itemVariants} className="text-4xl font-black font-outfit tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400 inline-block mb-1">
            Dashboard
          </motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-500" /> Overview of your civic engagement
          </motion.p>
        </div>
        {!isDepartment && (
          <motion.div variants={itemVariants}>
            <AnimatedButton onClick={() => setIsModalOpen(true)} icon={<Plus className="w-5 h-5" />} className="px-6 py-3 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              File Grievance
            </AnimatedButton>
          </motion.div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {kpis.map((stat, i) => (
          <motion.div key={stat.label} variants={itemVariants} className="h-full group">
            <GlassCard hoverEffect={true} delay={i * 0.1} className={`relative overflow-hidden h-full border border-white/10 dark:border-white/5 transition-all duration-500 group-hover:${stat.glow} group-hover:ring-1 group-hover:${stat.ring}`}>
              {/* Background ambient gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.gradient} rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] mb-2">
                    {stat.label}
                  </p>
                  <motion.h4 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1), type: "spring" }}
                    className="text-5xl font-black text-slate-900 dark:text-white font-outfit tracking-tighter"
                  >
                    {stat.value}
                  </motion.h4>
                </div>
                <div className={`rounded-2xl p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} strokeWidth={1.5} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Complaints Table */}
      <motion.div variants={itemVariants}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
            {isDepartment ? 'Assigned Complaints' : 'Recent Filings'}
          </h3>
        </div>

        <GlassCard className="p-0 overflow-hidden border-white/10 dark:border-white/5 shadow-2xl backdrop-blur-xl bg-white/40 dark:bg-[#060b1e]/60">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center text-slate-500 flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="animate-pulse font-medium tracking-wide">Syncing data...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-24 text-center text-slate-500 flex flex-col items-center">
                <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-6" strokeWidth={1} />
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 font-outfit">No activity found</p>
                {!isDepartment && <p className="text-sm font-medium">Be the change—file a grievance above!</p>}
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
                <thead className="bg-slate-100/50 dark:bg-slate-900/80 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="py-5 px-6 font-bold border-b border-slate-200/50 dark:border-slate-800/50">Title</th>
                    <th className="py-5 px-6 font-bold border-b border-slate-200/50 dark:border-slate-800/50">Category</th>
                    <th className="py-5 px-6 font-bold border-b border-slate-200/50 dark:border-slate-800/50">Priority</th>
                    <th className="py-5 px-6 font-bold border-b border-slate-200/50 dark:border-slate-800/50">Status</th>
                    <th className="py-5 px-6 font-bold border-b border-slate-200/50 dark:border-slate-800/50">Filed Date</th>
                    {isDepartment && <th className="py-5 px-6 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30">
                  <AnimatePresence>
                    {complaints.map((complaint, index) => (
                      <motion.tr 
                        key={complaint.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, ease: "easeOut" }}
                        className="group hover:bg-white/80 dark:hover:bg-slate-800/40 transition-all duration-300 cursor-pointer"
                        onClick={() => !isDepartment && setSelectedComplaint(complaint)}
                      >
                        <td className="py-5 px-6">
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-500 transition-colors cursor-pointer" onClick={() => setSelectedComplaint(complaint)}>
                            {complaint.title}
                          </p>
                        </td>
                        <td className="py-5 px-6 font-medium text-slate-600 dark:text-slate-400">{complaint.category}</td>
                        <td className="py-5 px-6">
                          <PriorityBadge priority={complaint.priority} />
                        </td>
                        <td className="py-5 px-6">
                          <StatusBadge status={complaint.status} isDepartment={isDepartment} />
                        </td>
                        <td className="py-5 px-6 text-slate-500 dark:text-slate-400 font-medium text-xs tracking-wide">
                          {(() => { const d = Array.isArray(complaint.createdAt) ? new Date(complaint.createdAt[0], complaint.createdAt[1]-1, complaint.createdAt[2]) : new Date(complaint.createdAt); return isNaN(d) ? 'N/A' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); })()}
                        </td>
                        {isDepartment && (
                          <td className="py-5 px-6 text-right">
                            <div className="flex items-center justify-end gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedComplaint(complaint); }}
                                className="relative overflow-hidden group/btn px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-700 dark:text-slate-200 bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-orange-500/20 backdrop-blur-sm"
                              >
                                <span className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                <ExternalLink className="w-3.5 h-3.5 text-orange-500 group-hover/btn:scale-110 transition-transform" /> 
                                <span className="relative z-10 group-hover/btn:text-orange-600 dark:group-hover/btn:text-orange-400 transition-colors">View</span>
                              </button>
                              {complaint.status === 'SUBMITTED' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(updateComplaintStatus({ id: complaint.id, status: 'ACCEPTED', comment: 'Accepted by officer' }));
                                  }}
                                  className="relative overflow-hidden group/btn px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-sm hover:shadow-emerald-500/20 backdrop-blur-sm"
                                >
                                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                  <span className="relative z-10">Accept</span>
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {!isDepartment && <NewComplaintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      
      <ComplaintDetailsModal 
        isOpen={!!selectedComplaint} 
        onClose={() => setSelectedComplaint(null)} 
        complaint={selectedComplaint} 
        isDepartment={isDepartment}
        onStatusUpdate={(id, status, comment) => {
          dispatch(updateComplaintStatus({ id, status, comment }));
          setSelectedComplaint(null);
        }}
        onAssign={(id, supervisorId) => {
          dispatch(assignComplaint({ id, supervisorId }));
          setSelectedComplaint(null);
        }}
      />
    </motion.div>
  );
}
