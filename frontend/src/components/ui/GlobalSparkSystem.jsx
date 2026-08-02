// GlobalSparkSystem — lightweight version
// Replaced per-particle Framer Motion instances (GPU filter + boxShadow per spark)
// with a single CSS-animation-driven approach using a pool of reusable DOM nodes.
// This eliminates the React reconciler overhead and GPU compositing cost.

import React, { useEffect, useRef, useCallback } from 'react';

const COLORS = ['#fb923c', '#f97316', '#fbbf24', '#ffffff', '#fdba74'];
const SPARK_COUNT = 10; // reduced from 22

let counter = 0;

export default function GlobalSparkSystem() {
  const containerRef = useRef(null);
  const lastTargetRef = useRef(null);

  const spawnSparks = useCallback((rect) => {
    const container = containerRef.current;
    if (!container) return;

    const { left, top, width, height } = rect;

    for (let i = 0; i < SPARK_COUNT; i++) {
      const spark = document.createElement('span');
      const size = Math.random() * 4 + 1.5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = Math.random() * 360;
      const speed = 20 + Math.random() * 30;
      const rad = (angle * Math.PI) / 180;
      const dx = Math.cos(rad) * speed;
      const dy = Math.sin(rad) * speed;

      // Spawn randomly on border of the button
      const side = Math.floor(Math.random() * 4);
      let sx, sy;
      if (side === 0) { sx = Math.random() * width; sy = 0; }
      else if (side === 1) { sx = width; sy = Math.random() * height; }
      else if (side === 2) { sx = Math.random() * width; sy = height; }
      else { sx = 0; sy = Math.random() * height; }

      spark.style.cssText = `
        position: fixed;
        left: ${left + sx}px;
        top: ${top + sy}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transform: translate(0,0) scale(1);
        transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        will-change: transform, opacity;
      `;

      container.appendChild(spark);

      // Trigger animation on next frame
      requestAnimationFrame(() => {
        spark.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        spark.style.opacity = '0';
      });

      setTimeout(() => spark.remove(), 520);
    }
  }, []);

  const handleMouseOver = useCallback((e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!e.target || typeof e.target.closest !== 'function') return;
    const target = e.target.closest('button, [role="button"], .btn, .magnetic');
    if (!target || target.disabled) return;
    if (target === lastTargetRef.current) return;
    lastTargetRef.current = target;
    spawnSparks(target.getBoundingClientRect());
  }, [spawnSparks]);

  const handleMouseOut = useCallback((e) => {
    if (!e.target || typeof e.target.closest !== 'function') return;
    const target = e.target.closest('button, [role="button"], .btn, .magnetic');
    if (target && e.relatedTarget && !target.contains(e.relatedTarget)) {
      if (lastTargetRef.current === target) lastTargetRef.current = null;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseOver, handleMouseOut]);

  return <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />;
}
