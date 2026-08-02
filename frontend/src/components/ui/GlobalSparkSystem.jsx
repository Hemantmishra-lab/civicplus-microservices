import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// ---------------------------------------------------------------------------
// Spark Particle — single spark that flies out from the button on hover
// ---------------------------------------------------------------------------
const Spark = ({ id, x, y, angle, speed, size, color, onDone }) => {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * speed;
  const dy = Math.sin(rad) * speed;

  return (
    <motion.span
      style={{
        position: 'fixed', // relative to viewport
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        pointerEvents: 'none',
        zIndex: 9999, // very high to sit on top of everything
        filter: `blur(${size * 0.3}px)`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: dx, y: dy, opacity: 0, scale: 0 }}
      transition={{ duration: 0.4 + Math.random() * 0.3, ease: [0.2, 0.8, 0.4, 1] }}
      onAnimationComplete={onDone}
    />
  );
};

// ---------------------------------------------------------------------------
// Global Spark System — spawns sparks on every button hover project-wide
// ---------------------------------------------------------------------------
const GlobalSparkSystem = () => {
  const [sparks, setSparks] = useState([]);
  const counterRef = useRef(0);

  const lastTargetRef = useRef(null);

  const handleMouseOver = useCallback((e) => {
    // Only trigger if we hovered a button (or element acting as button or magnetic link)
    if (!e.target || typeof e.target.closest !== 'function') return;
    const target = e.target.closest('button, [role="button"], .btn, .magnetic');
    if (!target) return;

    // Prevent re-triggering if we are just moving between children inside the same button
    if (target === lastTargetRef.current) return;
    lastTargetRef.current = target;

    // Optional: skip if it's disabled or explicitly has reduced motion
    if (target.disabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = target.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const SPARK_COUNT = 22;
    const colors = [
      '#fb923c', // orange-400
      '#f97316', // orange-500
      '#fbbf24', // amber-400
      '#ffffff', // white flash
      '#fdba74', // orange-300
      '#ff6b35', // vivid orange
      '#ffe066', // yellow
    ];

    const newSparks = Array.from({ length: SPARK_COUNT }, () => {
      const side = Math.floor(Math.random() * 4);
      let spawnX, spawnY;
      if (side === 0) { spawnX = Math.random() * w; spawnY = 0; }
      else if (side === 1) { spawnX = w; spawnY = Math.random() * h; }
      else if (side === 2) { spawnX = Math.random() * w; spawnY = h; }
      else { spawnX = 0; spawnY = Math.random() * h; }

      const baseAngle = Math.atan2(spawnY - h / 2, spawnX - w / 2) * (180 / Math.PI);
      const angle = baseAngle + (Math.random() - 0.5) * 70;

      return {
        id: ++counterRef.current,
        x: rect.left + spawnX,
        y: rect.top + spawnY,
        angle,
        speed: 10 + Math.random() * 20, 
        size: Math.random() * 4 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setSparks((prev) => [...prev, ...newSparks]);
  }, []);

  const handleMouseOut = useCallback((e) => {
    if (!e.target || typeof e.target.closest !== 'function') return;
    const target = e.target.closest('button, [role="button"], .btn, .magnetic');
    
    // If we left the button entirely (not just moving to a child)
    if (target && e.relatedTarget && !target.contains(e.relatedTarget)) {
      if (lastTargetRef.current === target) {
        lastTargetRef.current = null;
      }
    }
  }, []);

  const removeSpark = useCallback((id) => {
    setSparks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  useEffect(() => {
    // Use mouseover/mouseout with bubbling instead of expensive capture-phase mouseenter
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseOver, handleMouseOut]);

  return (
    <>
      {sparks.map((s) => (
        <Spark key={s.id} {...s} onDone={() => removeSpark(s.id)} />
      ))}
    </>
  );
};

export default GlobalSparkSystem;
