import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComplaint } from '../store/complaintSlice';
import { X, MapPin, UploadCloud, Loader2 } from 'lucide-react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from './ui/AnimatedButton';

export default function NewComplaintModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sanitation');
  const [priority, setPriority] = useState('LOW');
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleAutoLocate = () => {
    setIsLocating(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);

        try {
          // Use Geoapify Reverse Geocoding with provided key
          const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=173367ebdc8e420ea34ebcfa3ccbc86c`);
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            if (props.suburb || props.city) setArea(props.suburb || props.city);
            if (props.state_district || props.county || props.state) setDistrict(props.state_district || props.county || props.state);
          }
        } catch (err) {
          console.error("Failed to fetch location details", err);
          setLocationError('Failed to parse location details');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setLocationError('Unable to retrieve your location');
        setIsLocating(false);
      }
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    let finalLat = latitude;
    let finalLng = longitude;

    if ((!finalLat || !finalLng) && (area || district)) {
      try {
        const queryText = [area, district].filter(Boolean).join(', ');
        const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(queryText)}&apiKey=173367ebdc8e420ea34ebcfa3ccbc86c`);
        const geoData = await geoRes.json();
        if (geoData.features && geoData.features.length > 0) {
          finalLat = geoData.features[0].properties.lat;
          finalLng = geoData.features[0].properties.lon;
          setLatitude(finalLat);
          setLongitude(finalLng);
        }
      } catch (err) {
        console.error("Forward geocoding failed", err);
      }
    }

    let imageUrls = [];
    if (evidenceFile) {
      const formData = new FormData();
      formData.append('file', evidenceFile);
      try {
        const uploadRes = await API.post('/api/v1/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (uploadRes.data && uploadRes.data.downloadUrl) {
          imageUrls.push(uploadRes.data.downloadUrl);
        }
      } catch (err) {
        console.error("Failed to upload evidence", err);
      }
    }

    const payload = { 
      title, 
      description, 
      category, 
      priority, 
      area, 
      district,
      latitude: finalLat,
      longitude: finalLng,
      imageUrls
    };
    
    const result = await dispatch(createComplaint(payload));
    setIsUploading(false);
    
    if (createComplaint.fulfilled.match(result)) {
      onClose();
      setTitle('');
      setDescription('');
      setArea('');
      setDistrict('');
      setLatitude(null);
      setLongitude(null);
      setEvidenceFile(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 p-6 relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">File New Grievance</h2>
            <button
              onClick={onClose}
              type="button"
              className="rounded-full p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)] space-y-6 relative z-10 custom-scrollbar" data-lenis-prevent="true">
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm shadow-inner"
                  placeholder="E.g., Garbage accumulation near park"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm shadow-inner resize-none"
                  placeholder="Provide details about the issue..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="Sanitation">Sanitation</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Roads & Traffic">Roads & Traffic</option>
                    <option value="Electricity">Electricity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white/30 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Location Details</label>
                <button 
                  type="button" 
                  onClick={handleAutoLocate}
                  disabled={isLocating}
                  className="flex items-center text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50"
                >
                  {isLocating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <MapPin className="w-4 h-4 mr-1" />}
                  {isLocating ? 'Locating...' : 'Auto-detect'}
                </button>
              </div>
              
              {locationError && (
                <div className="text-xs text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{locationError}</div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm shadow-inner"
                    placeholder="Area (e.g. Rosera)"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm shadow-inner"
                    placeholder="District (e.g. Samastipur)"
                  />
                </div>
              </div>
              
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Evidence (Optional)</label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="evidence-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-2xl cursor-pointer bg-white/30 dark:bg-slate-900/30 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:border-orange-500/50 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {evidenceFile ? evidenceFile.name : 'Click to upload proof'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Image or PDF up to 5MB</p>
                  </div>
                  <input id="evidence-upload" type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <AnimatedButton
                type="submit"
                isLoading={isUploading}
                className="px-8 py-2.5"
              >
                {isUploading ? 'Submitting...' : 'Submit Grievance'}
              </AnimatedButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
