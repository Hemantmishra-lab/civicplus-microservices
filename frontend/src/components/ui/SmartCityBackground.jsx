import React from 'react';

// Optimized SmartCityBackground — removed:
// 1. mousemove listener + useSpring spotlight (caused GPU repaints every frame)
// 2. 20 infinite Framer Motion particles (repeat: Infinity on each)
// 3. useScroll parallax transforms (continuous scroll tracking)
// 4. External stardust texture (unnecessary network request + mix-blend-screen)
// 5. Two motion.div radial-gradient spotlights (expensive composited layers)
// Replaced with a static, GPU-friendly background using only CSS.

export default function SmartCityBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
      {/* City skyline image — static, no parallax */}
      <div
        className="absolute -top-[200px] -bottom-[200px] left-0 right-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: 'url("/smart_city_bg.png")' }}
      />

      {/* Base Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#091124]/30 to-[#020617]/60" />

      {/* Cyber Grid — static, no parallax transform */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(249, 115, 22, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'top center',
          willChange: 'auto',
        }}
      />

      {/* Static ambient orbs — CSS-only, no JS animation */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-orange-600/20 blur-[100px]" />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-slate-900/30 dark:bg-[#020617]/50" />
    </div>
  );
}
