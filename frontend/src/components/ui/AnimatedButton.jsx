import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Energy Break Particle System Overlay (on click)
// ---------------------------------------------------------------------------
const EnergyBreakEffect = ({ onComplete }) => {
  const particles = Array.from({ length: 30 });
  const cracks = Array.from({ length: 5 });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-visible">
      {/* Intense Center Flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 10, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute w-4 h-4 bg-white rounded-full blur-md mix-blend-overlay"
      />

      {/* Glass Cracks SVG */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{ filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.8))' }}
      >
        {cracks.map((_, i) => (
          <motion.path
            key={i}
            d={`M ${50 + Math.random() * 20} ${50 + Math.random() * 20} L ${Math.random() * 150 - 25} ${Math.random() * 150 - 25}`}
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {/* Shards Burst */}
      {particles.map((_, i) => {
        const angle = (Math.PI * 2 * i) / particles.length;
        const velocity = 50 + Math.random() * 150;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        const size = Math.random() * 6 + 2;
        const isBlue = Math.random() > 0.5;
        return (
          <motion.div
            key={i}
            className={cn('absolute rounded-full blur-[1px]', isBlue ? 'bg-blue-400' : 'bg-orange-400')}
            style={{ width: size, height: size }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y: y - 50, scale: 0, opacity: 0, rotate: Math.random() * 360 }}
            transition={{ duration: 0.6 + Math.random() * 0.4, ease: [0.19, 1, 0.22, 1] }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Animated Button
// ---------------------------------------------------------------------------
export const AnimatedButton = ({
  children,
  onClick,
  className,
  variant = 'primary',
  type = 'button',
  disabled = false,
  isLoading = false,
  icon = null,
}) => {
  const [isExploding, setIsExploding] = useState(false);
  const [useReducedMotion, setUseReducedMotion] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setUseReducedMotion(mediaQuery.matches);
  }, []);

  const handleClick = (e) => {
    if (disabled || isLoading || isExploding) return;
    if (useReducedMotion) {
      if (onClick) onClick(e);
      return;
    }
    setIsExploding(true);
    setTimeout(() => {
      if (onClick) onClick(e);
    }, 400);
  };

  const handleExplosionComplete = () => setIsExploding(false);

  const baseStyles =
    'relative overflow-visible font-semibold rounded-full flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 focus:ring-orange-500 border border-white/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 focus:ring-slate-700',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 focus:ring-orange-500',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500',
    white: 'bg-white text-slate-900 hover:bg-slate-50 shadow-lg shadow-white/20 focus:ring-white border border-slate-200',
  };

  const sizeStyles = 'px-6 py-3 text-sm';

  return (
    <div className="relative inline-flex w-full">
      <motion.button
        ref={buttonRef}
        type={type}
        whileTap={disabled || isExploding ? {} : { scale: 0.95 }}
        onClick={handleClick}
        disabled={disabled || isLoading}
        animate={
          isExploding
            ? { opacity: 0, scale: 0.8, filter: 'brightness(2)' }
            : { opacity: 1, scale: 1, filter: 'brightness(1)' }
        }
        transition={{ duration: isExploding ? 0.2 : 0.4 }}
        className={cn(baseStyles, variants[variant], sizeStyles, 'w-full group', className)}
      >
        {/* Animated idle gradient shift (shine) */}
        <div className={cn(
          "absolute inset-0 bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat group-hover:animate-[shine_1.5s_ease-in-out_infinite] rounded-full pointer-events-none",
          variant === 'white' 
            ? "bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_50%,transparent_75%)]" 
            : "bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)]"
        )} />
        
        {/* Hover expanding shadow glow */}
        <div className={cn(
          "absolute -inset-1 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500 rounded-full z-[-1]",
          variant === 'white'
            ? "bg-gradient-to-r from-slate-200 to-slate-400 group-hover:opacity-50"
            : "bg-gradient-to-r from-orange-500 to-blue-500"
        )} />

        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current relative z-10" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <span className="relative z-10 flex items-center justify-center">{icon}</span>
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>

      {/* Energy break overlay on click */}
      <AnimatePresence>
        {isExploding && <EnergyBreakEffect onComplete={handleExplosionComplete} />}
      </AnimatePresence>
    </div>
  );
};
