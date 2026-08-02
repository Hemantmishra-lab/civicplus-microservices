import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, verifyAccount } from '../store/authSlice';
import { User, Building2, KeyRound, MapPin, Loader2, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedButton } from '../components/ui/AnimatedButton';

export default function Register() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isDept, setIsDept] = useState(false);
  const [role, setRole] = useState('CITIZEN');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isDept && (!latitude || !longitude) && (!area || !district)) {
      setLocationError('Please auto-detect your location or enter it manually.');
      return;
    }

    let finalLat = latitude;
    let finalLng = longitude;

    if (isDept && (!finalLat || !finalLng) && (area || district)) {
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

    const selectedRole = isDept ? role : 'CITIZEN';
    const result = await dispatch(registerUser({ fullName, username, email, password, role: selectedRole }));
    if (registerUser.fulfilled.match(result)) {
      setStep(2);
    }
  };

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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyAccount({ email, otp }));
    if (verifyAccount.fulfilled.match(result)) {
      if (isDept) {
        try {
          const token = result.payload.token;
          await API.put('/api/v1/users/profile', {
            role,
            latitude,
            longitude,
            department: role,
            area,
            district
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error("Failed to update profile", err);
        }
      }
      navigate('/dashboard');
    }
  };

  return (
    <AuroraBackground showRadialGradient={true}>
      <div className="flex min-h-screen items-center justify-center w-full p-4 relative z-10 my-10">
        <GlassCard className="w-full max-w-md p-8 sm:p-10 border-white/20 dark:border-white/10" delay={0.2}>
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2"
            >
              {step === 1 ? 'Join ' : 'Verify '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">CivicPlus</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              {step === 1 ? (
                <>
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-orange-500 hover:text-rose-500 transition-colors">
                    Sign in instead
                  </Link>
                </>
              ) : (
                `Enter the 6-digit OTP sent to ${email}`
              )}
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400 border border-red-500/20 mb-6"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6" 
                onSubmit={handleRegisterSubmit}
              >
                {/* Role Switcher */}
                <div className="relative flex w-full p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl border border-white/20 dark:border-white/5 backdrop-blur-sm">
                  <motion.div
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-700 rounded-lg shadow-md"
                    layout
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    initial={false}
                    animate={{ left: !isDept ? '4px' : 'calc(50%)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsDept(false)}
                    className={`relative z-10 flex flex-1 items-center justify-center py-2.5 text-sm font-semibold transition-colors ${
                      !isDept ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" /> Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDept(true)}
                    className={`relative z-10 flex flex-1 items-center justify-center py-2.5 text-sm font-semibold transition-colors ${
                      isDept ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mr-2" /> Department
                  </button>
                </div>

                <AnimatePresence>
                  {isDept && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-4"
                    >
                      <div>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm"
                        >
                          <option value="DEPARTMENTAL_OFFICER">Departmental Officer</option>
                          <option value="HEAD_OFFICER">Head Officer</option>
                          <option value="AREA_INCHARGE">Area Incharge</option>
                          <option value="SUPERVISOR">Supervisor</option>
                          <option value="DISTRICT">District Authority</option>
                          <option value="HEADQUARTER">Headquarter Authority</option>
                        </select>
                      </div>

                      <div className="space-y-3 bg-white/30 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Jurisdiction Area</label>
                          <button 
                            type="button" 
                            onClick={handleAutoLocate}
                            disabled={isLocating}
                            className="flex items-center text-xs font-semibold text-orange-500 hover:text-rose-500 transition-colors disabled:opacity-50"
                          >
                            {isLocating ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <MapPin className="w-3.5 h-3.5 mr-1" />}
                            {isLocating ? 'Locating...' : 'Auto-detect'}
                          </button>
                        </div>
                        {locationError && <p className="text-xs text-red-500">{locationError}</p>}
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder="Area"
                          />
                          <input
                            type="text"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder="District"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
                      placeholder="Username"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
                      placeholder="Email address"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <AnimatedButton
                  type="submit"
                  isLoading={loading}
                  className="w-full py-4 text-base"
                  icon={!loading && <ArrowRight className="w-5 h-5" />}
                >
                  {loading ? 'Processing...' : 'Create Account'}
                </AnimatedButton>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6" 
                onSubmit={handleOtpSubmit}
              >
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-4 text-center tracking-[0.5em] font-mono text-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
                    placeholder="000000"
                  />
                </div>

                <div className="space-y-3">
                  <AnimatedButton
                    type="submit"
                    isLoading={loading}
                    disabled={otp.length < 6}
                    className="w-full py-4 text-base"
                    icon={!loading && <ArrowRight className="w-5 h-5" />}
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </AnimatedButton>
                  
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors py-2"
                  >
                    Back to Registration
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </AuroraBackground>
  );
}
