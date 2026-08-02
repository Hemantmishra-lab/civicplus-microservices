import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints, updateComplaintStatus, assignComplaint, escalateComplaint } from '../store/complaintSlice';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import NewComplaintModal from '../components/NewComplaintModal';
import { FileText, Search, Filter, ExternalLink, AlertTriangle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { StatusBadge, PriorityBadge } from '../components/ui/PremiumBadges';

export default function ComplaintsPage() {
  const dispatch = useDispatch();
  const { list: complaints, loading } = useSelector((state) => state.complaints);
  const { role } = useSelector((state) => state.auth);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isNewComplaintModalOpen, setIsNewComplaintModalOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  const isDepartment = role && String(role).toUpperCase() !== 'CITIZEN';
  
  const handleEscalate = async (id) => {
    try {
      await dispatch(escalateComplaint(id)).unwrap();
      alert('Complaint escalated successfully!');
    } catch (err) {
      alert(err);
    }
  };
  
  const handleStatusUpdate = async (id, status, comment) => {
    await dispatch(updateComplaintStatus({ id, status, comment }));
    setSelectedComplaint(null);
  };

  const handleAssign = async (id, supervisorId) => {
    await dispatch(assignComplaint({ id, supervisorId }));
    setSelectedComplaint(null);
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'ALL' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative z-10"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-4">
        <div>
          <h1 className="text-4xl font-black font-outfit tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400 inline-block mb-1">
            Complaints Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" /> View and manage all {isDepartment ? 'assigned' : 'your filed'} complaints in one place.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          {!isDepartment && (
            <AnimatedButton onClick={() => setIsNewComplaintModalOpen(true)} icon={<Plus className="w-5 h-5" />} className="w-full sm:w-auto px-6 py-2.5 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              File Complaint
            </AnimatedButton>
          )}
          <div className="relative flex-1 sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all shadow-inner font-medium placeholder-slate-400"
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none transition-all shadow-inner cursor-pointer font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden border-white/10 dark:border-white/5 shadow-2xl backdrop-blur-xl bg-white/40 dark:bg-[#060b1e]/60" delay={0.2}>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-500 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="animate-pulse font-medium tracking-wide">Syncing records...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-24 text-center text-slate-500 flex flex-col items-center">
              <FileText className="h-16 w-16 mb-6 text-slate-300 dark:text-slate-700" strokeWidth={1} />
              <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 font-outfit">No complaints found</p>
              <p className="text-sm font-medium">Try adjusting your filters or search term.</p>
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
                  <th className="py-5 px-6 font-bold border-b border-slate-200/50 dark:border-slate-800/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30">
                <AnimatePresence>
                  {filteredComplaints.map((complaint, index) => (
                    <motion.tr 
                      key={complaint.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, ease: "easeOut" }}
                      className="group hover:bg-white/80 dark:hover:bg-slate-800/40 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <td className="py-5 px-6">
                        <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-500 transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedComplaint(complaint); }}>
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

                          {complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
                            (role === 'CITIZEN' && (new Date() - new Date(complaint.createdAt)) > 7 * 24 * 60 * 60 * 1000) ||
                            (role === 'AREA_INCHARGE' || role === 'DISTRICT')
                          ) && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEscalate(complaint.id); }}
                              className="relative overflow-hidden group/btn px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest text-rose-700 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 shadow-sm hover:shadow-rose-500/20 backdrop-blur-sm"
                            >
                              <span className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                              <AlertTriangle className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" /> 
                              <span className="relative z-10">Escalate</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      <ComplaintDetailsModal 
        isOpen={!!selectedComplaint} 
        onClose={() => setSelectedComplaint(null)} 
        complaint={selectedComplaint}
        isDepartment={isDepartment}
        onStatusUpdate={handleStatusUpdate}
        onAssign={handleAssign}
      />

      <NewComplaintModal
        isOpen={isNewComplaintModalOpen}
        onClose={() => setIsNewComplaintModalOpen(false)}
      />
    </motion.div>
  );
}
