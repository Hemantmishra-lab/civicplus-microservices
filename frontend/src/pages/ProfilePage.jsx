import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Image as ImageIcon, Check, X, Camera, LogOut, Shield, Award } from 'lucide-react';
import API from '../api/axios';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { StatusBadge } from '../components/ui/PremiumBadges';

const resolveImageUrl = (url) => {
  if (!url) return '';
  // Legacy broken local container paths
  if (url.includes('localhost:8082')) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:8080${url}`;
};

export default function ProfilePage() {
  const { email, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatarUrl: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingAvatar(true);
    try {
      const res = await API.post('/api/v1/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditForm({ ...editForm, avatarUrl: res.data.downloadUrl });
    } catch (err) {
      console.error('Failed to upload avatar', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const complaintsEndpoint = String(role).toUpperCase() === 'CITIZEN' ? '/api/v1/complaints/citizen' : '/api/v1/complaints/assigned';
      const [profileRes, complaintsRes] = await Promise.all([
        API.get('/api/v1/users/profile'),
        API.get(complaintsEndpoint).catch(() => ({ data: [] }))
      ]);
      
      setProfile(profileRes.data);
      setEditForm({
        firstName: profileRes.data.firstName || '',
        lastName: profileRes.data.lastName || '',
        bio: profileRes.data.bio || '',
        avatarUrl: profileRes.data.avatarUrl || ''
      });
      
      setComplaints(complaintsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await API.put('/api/v1/users/profile', editForm);
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-slate-500 dark:text-slate-400 animate-pulse font-bold tracking-widest uppercase text-xs">Loading Profile...</p>
        </div>
      </div>
    );
  }

  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;
  const pendingCount = complaints.length - resolvedCount;
  const isDepartment = role && String(role).toUpperCase() !== 'CITIZEN';

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-12 relative z-10">
      {/* Profile Header */}
      <GlassCard className="p-8 md:p-12 border-white/10 dark:border-white/5 relative overflow-hidden shadow-2xl bg-white/40 dark:bg-[#060b1e]/60 backdrop-blur-2xl" delay={0.1}>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/20 to-rose-500/20 blur-[100px] pointer-events-none animate-pulse duration-1000" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 blur-[100px] pointer-events-none animate-pulse delay-700 duration-1000" />
        
        <div className="flex flex-col md:flex-row items-center md:items-center gap-10 relative z-10">
          {/* Avatar */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="relative group flex-shrink-0"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 animate-spin-slow opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
            <div className="h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden ring-2 ring-white/20 dark:ring-white/10 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.15)] relative z-10 p-1">
              <div className="h-full w-full rounded-full overflow-hidden bg-slate-800">
                {profile?.avatarUrl ? (
                  <img src={resolveImageUrl(profile.avatarUrl)} alt="Avatar" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-6xl text-slate-400 dark:text-slate-600 font-black font-outfit bg-slate-100 dark:bg-slate-900">
                    {profile?.firstName?.[0] || email?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            {isDepartment && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-rose-500 p-3 rounded-full shadow-lg border-4 border-slate-50 dark:border-[#020617] z-20">
                <Shield className="w-6 h-6 text-white" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <div className="flex-1 space-y-6 text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-outfit bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <div className="font-semibold text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center md:justify-start gap-2 text-sm tracking-wide">
                  {email}
                  <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 font-bold border border-orange-500/20">{role}</span>
                  {profile?.userId && (
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> ID: {profile.userId}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 rounded-xl bg-white/50 hover:bg-white/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 text-sm font-bold text-slate-800 dark:text-white transition-all flex items-center gap-2 border border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-md"
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-sm font-bold text-rose-600 dark:text-rose-400 transition-all flex items-center gap-2 border border-rose-500/20 shadow-sm backdrop-blur-md"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-10 text-sm text-slate-600 dark:text-slate-300 py-4 border-y border-slate-200/50 dark:border-slate-800/50">
              <div className="flex flex-col items-center md:items-start group">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-outfit group-hover:text-blue-500 transition-colors">{complaints.length}</span> 
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Total {isDepartment ? 'Assigned' : 'Filed'}</span>
              </div>
              <div className="flex flex-col items-center md:items-start group">
                <span className="text-3xl font-black text-emerald-500 font-outfit group-hover:scale-110 transition-transform origin-bottom">{resolvedCount}</span> 
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Resolved</span>
              </div>
              <div className="flex flex-col items-center md:items-start group">
                <span className="text-3xl font-black text-orange-500 font-outfit group-hover:scale-110 transition-transform origin-bottom">{pendingCount}</span> 
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Pending</span>
              </div>
            </div>

            <div className="text-base text-slate-600 dark:text-slate-400 bg-white/30 dark:bg-slate-900/30 p-5 rounded-2xl border border-white/20 dark:border-white/5 backdrop-blur-sm relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <p className="whitespace-pre-wrap leading-relaxed relative z-10 font-medium">{profile?.bio || 'No bio provided. Tell us about yourself and your role in the community!'}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Grid Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-center border-t border-slate-200 dark:border-slate-800/50 pt-8 mb-10 relative">
          <div className="absolute top-0 -mt-[1px] w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
          <div className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase flex items-center gap-3 bg-slate-50 dark:bg-[#020617] px-6 -mt-12 rounded-full border border-slate-200 dark:border-slate-800/50 py-2 shadow-sm">
            <Award className="h-4 w-4 text-orange-500" /> Activity History
          </div>
        </div>

        {complaints.length === 0 ? (
          <GlassCard className="text-center py-24 text-slate-500 border-dashed border-2 bg-transparent">
            <Camera className="h-16 w-16 mx-auto mb-6 text-slate-300 dark:text-slate-700" strokeWidth={1} />
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-outfit tracking-tight">No History Found</p>
            <p className="text-sm font-medium">Your reported or assigned issues will appear here in a beautiful grid.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {complaints.map((complaint, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                  key={complaint.id} 
                  className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden cursor-pointer border border-white/20 dark:border-white/5 hover:border-orange-500/30 dark:hover:border-orange-500/30 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    {complaint.images && complaint.images.length > 0 ? (
                      <img src={complaint.images[0].url} alt={complaint.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 transition-transform duration-700 group-hover:scale-105">
                        <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 right-4 z-20">
                      <StatusBadge status={complaint.status} isDepartment={isDepartment} />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 font-outfit">{complaint.title}</h3>
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{complaint.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-[2rem] p-8 md:p-10 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Edit Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full hover:scale-110">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={editForm.firstName} 
                      onChange={e => setEditForm({...editForm, firstName: e.target.value})}
                      className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={editForm.lastName} 
                      onChange={e => setEditForm({...editForm, lastName: e.target.value})}
                      className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Avatar Image</label>
                  <div className="flex items-center gap-5 bg-white/30 dark:bg-slate-950/30 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                    {editForm.avatarUrl ? (
                      <div className="h-16 w-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 ring-2 ring-white/50 shadow-lg">
                        <img src={resolveImageUrl(editForm.avatarUrl)} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center ring-2 ring-white/50 shadow-lg">
                        <ImageIcon className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:transition-colors cursor-pointer" 
                      />
                    </div>
                    {uploadingAvatar && <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-orange-500 shrink-0"></div>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Biography</label>
                  <textarea 
                    value={editForm.bio} 
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    rows={4}
                    placeholder="Tell the community about yourself..."
                    className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-none transition-all shadow-inner" 
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <AnimatedButton 
                    onClick={handleSaveProfile}
                    isLoading={saving}
                    className="px-8 py-3 shadow-lg shadow-orange-500/20"
                    icon={!saving && <Check className="h-4 w-4" />}
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
