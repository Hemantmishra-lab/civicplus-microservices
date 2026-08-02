import React, { useState, useEffect } from 'react';
import { X, MapPin, AlertCircle, FileText, Calendar, Shield, Clock, Send, UserCheck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import { AnimatedButton } from './ui/AnimatedButton';

const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';
  // Handle both ISO strings and arrays from Java LocalDateTime serialization [year,month,day,hour,min,sec]
  let date;
  if (Array.isArray(dateValue)) {
    const [year, month, day, hour = 0, min = 0, sec = 0] = dateValue;
    date = new Date(year, month - 1, day, hour, min, sec);
  } else {
    date = new Date(dateValue);
  }
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function ComplaintDetailsModal({ isOpen, onClose, complaint, isDepartment, onStatusUpdate, onAssign }) {
  const [history, setHistory] = useState([]);
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  useEffect(() => {
    if (isOpen && complaint?.id) {
      API.get(`/api/v1/complaints/${complaint.id}/history`)
        .then(res => setHistory(res.data))
        .catch(err => console.error("Failed to load history", err));
    }
  }, [isOpen, complaint]);

  if (!isOpen || !complaint) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 p-6 relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">Complaint Details</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-12rem)] space-y-8 relative z-10 custom-scrollbar" data-lenis-prevent="true">
            
            {/* Title & Status */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-outfit leading-tight flex-1">{complaint.title}</h3>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider h-fit ${
                  complaint.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' :
                  complaint.status === 'SUBMITTED' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' :
                  'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30'
                }`}>
                  {complaint.status === 'RESOLVED' && <CheckCircle className="w-3.5 h-3.5" />}
                  {isDepartment && complaint.status === 'SUBMITTED' ? 'PENDING' : complaint.status}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-4 whitespace-pre-wrap text-base leading-relaxed bg-white/50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                {complaint.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <FileText className="mr-2 h-4 w-4 text-blue-500" /> Category
                </div>
                <div className="text-slate-900 dark:text-white font-semibold">{complaint.category}</div>
              </div>
              
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <AlertCircle className={`mr-2 h-4 w-4 ${complaint.priority === 'HIGH' ? 'text-red-500' : complaint.priority === 'MEDIUM' ? 'text-orange-500' : 'text-blue-500'}`} /> Priority
                </div>
                <div className="text-slate-900 dark:text-white font-semibold">{complaint.priority}</div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
                <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <MapPin className="mr-2 h-4 w-4 text-orange-500" /> Location
                </div>
                <div className="text-slate-900 dark:text-white font-semibold">
                  {complaint.area}{complaint.district ? `, ${complaint.district}` : ''}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
                <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Shield className="mr-2 h-4 w-4 text-emerald-500" /> Assigned To / Dept
                </div>
                <div className="text-slate-900 dark:text-white font-semibold">
                  {complaint.assignedTo ? `Officer ID: ${complaint.assignedTo}` : 'Unassigned'} 
                  {complaint.department && ` (${complaint.department})`}
                </div>
              </div>
            </div>

            {/* Attached Proof */}
            {complaint.imageUrls && complaint.imageUrls.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center"><FileText className="w-4 h-4 mr-2"/> Attached Evidence</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {complaint.imageUrls.map((url, index) => (
                    <a 
                      key={index}
                      href={`http://localhost:8080${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group"
                    >
                      <img 
                        src={`http://localhost:8080${url}`} 
                        alt="Proof" 
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Section */}
            <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center"><Clock className="w-4 h-4 mr-2"/> Complaint Timeline</h4>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                {history.length === 0 ? (
                  <p className="text-sm font-medium text-slate-500 pl-8">No history available yet.</p>
                ) : (
                  history.map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index} 
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-orange-100 dark:bg-orange-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{item.status}</div>
                          <time className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{formatDate(item.updatedAt || item.timestamp)}</time>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.statusComment || 'Status updated'}</div>
                        {item.updatedById && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-3">Officer ID: {item.updatedById}</div>}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Officer Action Panel */}
            {isDepartment && complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
              <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center"><Shield className="w-4 h-4 mr-2"/> Officer Actions</h4>
                  {complaint.status === 'SUBMITTED' && (
                    <AnimatedButton 
                      variant="primary"
                      onClick={() => onStatusUpdate(complaint.id, 'ACCEPTED', 'Complaint accepted by officer')}
                      className="px-4 py-2 text-xs"
                      icon={<CheckCircle className="w-4 h-4" />}
                    >
                      Accept Complaint
                    </AnimatedButton>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Update */}
                  <div className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Update Status</label>
                    <div className="flex flex-col gap-3">
                      <select 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-inner appearance-none cursor-pointer"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="">Select Status...</option>
                        <option value="ACCEPTED">Accept</option>
                        <option value="UNDER_PROCESS">Under Process</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-inner"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button 
                        onClick={() => {
                          if(newStatus) onStatusUpdate(complaint.id, newStatus, comment);
                          setNewStatus(''); setComment('');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center transition-colors mt-1"
                      >
                        <Send className="w-4 h-4 mr-2"/> Post Update
                      </button>
                    </div>
                  </div>

                  {/* Re-assign */}
                  <div className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Re-assign / Escalate</label>
                    <div className="flex flex-col gap-3 h-full">
                      <input 
                        type="number" 
                        placeholder="Enter Officer ID..." 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-inner"
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                      />
                      <button 
                        onClick={() => {
                          if(assigneeId) onAssign(complaint.id, assigneeId);
                          setAssigneeId('');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center transition-colors mt-auto"
                      >
                        <UserCheck className="w-4 h-4 mr-2"/> Assign Officer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center items-center text-xs font-bold text-slate-400 uppercase tracking-wider pt-6 pb-2">
              <Calendar className="mr-2 h-4 w-4" />
              Filed on {formatDate(complaint.createdAt)}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
