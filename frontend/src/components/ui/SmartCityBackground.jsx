import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

export default function SmartCityBackground() {
  const { scrollY } = useScroll();

  // Parallax effects
  const yCity = useTransform(scrollY, [0, 1000], [0, 200]);
  const yClouds = useTransform(scrollY, [0, 1000], [0, 400]);
  const yGrid = useTransform(scrollY, [0, 1000], [0, 100]);

  // Mouse Spotlight Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    // Set initial position to center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Template for the radial gradient spotlight
  const spotlightBackground = useMotionTemplate`radial-gradient(circle 150px at ${springX}px ${springY}px, rgba(255,255,255,0.95), transparent)`;


  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
      {/* High-quality futuristic smart city skyline background (Generated AI Image) */}
      <motion.div 
        className="absolute -top-[200px] -bottom-[200px] left-0 right-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          y: yCity,
          backgroundImage: 'url("/smart_city_bg.png")',
        }}
      />

      {/* Base Dark Gradient Overlay - Reduced Opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#091124]/30 to-[#020617]/60" />

      {/* Cyber Grid */}
      <motion.div 
        className="absolute -top-[100px] -bottom-[100px] left-0 right-0 opacity-20"
        style={{
          y: yGrid,
          backgroundImage: 'linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'top center'
        }}
      />

      {/* Abstract City Shapes / Aurora */}
      <div className="absolute inset-0 animate-aurora opacity-30">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-blue-600/30 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-orange-600/30 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 rounded-full bg-indigo-600/20 blur-[150px]" />
      </div>

      {/* Clouds Parallax */}
      <motion.div 
        className="absolute -top-[400px] -bottom-[400px] left-0 right-0 opacity-40 mix-blend-screen"
        style={{
          y: yClouds,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")',
          backgroundSize: '300px'
        }}
      />

      {/* Moving Particles/Lights */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              backgroundColor: Math.random() > 0.5 ? '#f97316' : '#3b82f6',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Dark Transparent Overlay for Text Readability - Reduced Opacity */}
      <div className="absolute inset-0 bg-slate-900/30 dark:bg-[#020617]/50 backdrop-blur-[1px]" />

      {/* Interactive Mouse Spotlight */}
      <motion.div 
        className="fixed inset-0 pointer-events-none mix-blend-overlay z-10"
        style={{
          background: spotlightBackground,
        }}
      />
      <motion.div 
        className="fixed inset-0 pointer-events-none mix-blend-color-dodge opacity-100 z-10"
        style={{
          background: useMotionTemplate`radial-gradient(circle 100px at ${springX}px ${springY}px, rgba(249, 115, 22, 0.7), transparent)`,
        }}
      />
    </div>
  );
}
