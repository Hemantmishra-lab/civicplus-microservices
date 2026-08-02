import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedButton } from '../components/ui/AnimatedButton';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await API.post('/api/v1/auth/forgot-password', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await API.post('/api/v1/auth/verify-otp', { email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await API.post('/api/v1/auth/reset-password', { email, otp, newPassword });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground showRadialGradient={true}>
      <div className="flex min-h-screen items-center justify-center w-full p-4 relative z-10">
        <GlassCard className="w-full max-w-md p-8 sm:p-10 border-white/20 dark:border-white/10" delay={0.2}>
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2"
            >
              Reset <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Password</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              {step === 1 && 'Enter your email to receive an OTP'}
              {step === 2 && 'Enter the 6-digit OTP sent to your email'}
              {step === 3 && 'Create a new password'}
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
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6" 
                onSubmit={handleSendOtp}
              >
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

                <AnimatedButton
                  type="submit"
                  isLoading={loading}
                  className="w-full py-4 text-base"
                  icon={!loading && <ArrowRight className="w-5 h-5" />}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </AnimatedButton>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6" 
                onSubmit={handleVerifyOtp}
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

                <AnimatedButton
                  type="submit"
                  isLoading={loading}
                  disabled={otp.length < 6}
                  className="w-full py-4 text-base"
                  icon={!loading && <ArrowRight className="w-5 h-5" />}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </AnimatedButton>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form 
                key="step3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6" 
                onSubmit={handleResetPassword}
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      name="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
                      placeholder="New Password"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-inner"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>

                <AnimatedButton
                  type="submit"
                  isLoading={loading}
                  className="w-full py-4 text-base"
                  icon={!loading && <ArrowRight className="w-5 h-5" />}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </AnimatedButton>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors">
              Return to Login
            </Link>
          </div>
        </GlassCard>
      </div>
    </AuroraBackground>
  );
}
