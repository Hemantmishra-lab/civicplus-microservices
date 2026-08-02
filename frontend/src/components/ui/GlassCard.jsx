import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from './AnimatedButton';

// Optimized GlassCard — removed:
// 1. 3D tilt (rotateX/rotateY with useSpring) — caused GPU layer promotion on every card
// 2. Shine radial-gradient motion div — triggered repaints on every mousemove
// 3. Border glow motion div — same issue
// 4. useMotionValue + useSpring + useTransform chains (heavy when many cards on screen)
// Kept: entry animation, static gradient border lines, className passthrough

export const GlassCard = ({
  children,
  className,
  hoverEffect = false,
  delay = 0,
  ...props
}) => {
  const [useReducedMotion, setUseReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setUseReducedMotion(mq.matches);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl glass p-6 group cursor-default transition-shadow duration-300',
        hoverEffect && 'hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)]',
        className
      )}
      {...props}
    >
      {/* Subtle top/bottom gradient borders — static, no JS */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none" />

      <div className="relative z-20">{children}</div>
    </motion.div>
  );
};
