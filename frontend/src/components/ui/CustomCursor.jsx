import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState('idle');
  const [isHidden, setIsHidden] = useState(true);
  const [useReducedMotion, setUseReducedMotion] = useState(false);

  // Raw mouse coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Fast spring for inner dot
  const fastSpring = { damping: 25, stiffness: 600, mass: 0.1 };
  const smoothX = useSpring(cursorX, fastSpring);
  const smoothY = useSpring(cursorY, fastSpring);

  // Slow spring for trailing outer ring
  const slowSpring = { damping: 25, stiffness: 150, mass: 0.6 };
  const outerX = useSpring(cursorX, slowSpring);
  const outerY = useSpring(cursorY, slowSpring);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setUseReducedMotion(mediaQuery.matches);
    const handler = (e) => setUseReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (isHidden) setIsHidden(false);

      const target = e.target;
      if (target && typeof target.closest === 'function' && target.closest('button, [role="button"], a, .link, .magnetic, input, textarea, select')) {
        setCursorState('hover');
      } else {
        setCursorState('idle');
      }
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      mediaQuery.removeEventListener('change', handler);
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isHidden]);

  // Disable on mobile/touch devices or reduced motion
  if (typeof window === 'undefined' || window.innerWidth < 1024 || useReducedMotion) return null;

  return (
    <>
      {/* Outer Glow Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center rounded-full border-2 border-orange-500/40 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
        style={{
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
          width: 44,
          height: 44,
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHidden ? 0 : cursorState === 'hover' ? 0.3 : 1,
          scale: cursorState === 'hover' ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      {/* Inner Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHidden ? 0 : 1,
          scale: cursorState === 'hover' ? 4 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div 
          className="bg-white rounded-full transition-all duration-200"
          style={{
            width: '8px',
            height: '8px',
          }}
        />
      </motion.div>
    </>
  );
}
