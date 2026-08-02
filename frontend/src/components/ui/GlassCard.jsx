import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from './AnimatedButton';

export const GlassCard = ({ 
  children, 
  className,
  hoverEffect = false,
  delay = 0,
  ...props
}) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [useReducedMotion, setUseReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setUseReducedMotion(mediaQuery.matches);
  }, []);

  // Motion values for tilt and shine
  const x = useMotionValue(0.5); // 0 to 1 (left to right)
  const y = useMotionValue(0.5); // 0 to 1 (top to bottom)

  // Smooth springs for tilt
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Map 0-1 values to degrees for rotation (max 10 degrees)
  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10]);

  // Map mouse position to shine highlight position
  const shineX = useTransform(smoothX, [0, 1], [-100, 200]);
  const shineY = useTransform(smoothY, [0, 1], [-100, 200]);

  const handleMouseMove = (e) => {
    if (!ref.current || useReducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates from 0 to 1
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset tilt on leave
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        rotateX: hoverEffect && isHovered && !useReducedMotion ? rotateX : 0,
        rotateY: hoverEffect && isHovered && !useReducedMotion ? rotateY : 0,
        transformPerspective: 1000,
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass p-6 group cursor-default transition-all duration-300",
        hoverEffect && "hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)]",
        className
      )}
      {...props}
    >
      {/* 3D Inner Shine Reflection */}
      {hoverEffect && !useReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at calc(${shineX}% * 1px) calc(${shineY}% * 1px), rgba(255,255,255,0.4), transparent 40%)`,
          }}
        />
      )}

      {/* Interactive Border Glow */}
      {hoverEffect && !useReducedMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px circle at calc(${shineX}% * 1px) calc(${shineY}% * 1px), rgba(249,115,22,0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Subtle top/bottom gradient borders */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none" />
      
      <div className="relative z-20">
        {children}
      </div>
    </motion.div>
  );
};
