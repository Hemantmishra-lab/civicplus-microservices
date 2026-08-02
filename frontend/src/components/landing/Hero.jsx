import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, Cpu, MapPin, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '../ui/AnimatedButton';

export default function Hero() {
  const floatingTags = [
    { icon: ShieldAlert, text: "Report Issues", color: "orange", delay: 0, position: "top-1/4 left-[10%]" },
    { icon: CheckCircle2, text: "Track Progress", color: "emerald", delay: 1, position: "bottom-1/3 right-[10%]" },
    { icon: TrendingUp, text: "Smart Analytics", color: "blue", delay: 2, position: "top-1/3 right-[15%]" },
    { icon: Cpu, text: "AI Powered", color: "purple", delay: 1.5, position: "bottom-1/4 left-[15%]" },
    { icon: MapPin, text: "Location Sensing", color: "rose", delay: 0.5, position: "top-[15%] right-[30%]" },
    { icon: Bell, text: "Real-time Updates", color: "indigo", delay: 2.5, position: "bottom-[15%] left-[30%]" },
  ];

  const getColorClasses = (color) => {
    const map = {
      orange: "text-orange-500 border-orange-500/30 bg-orange-500/10 dark:bg-orange-900/30 shadow-orange-500/20",
      emerald: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-900/30 shadow-emerald-500/20",
      blue: "text-blue-500 border-blue-500/30 bg-blue-500/10 dark:bg-blue-900/30 shadow-blue-500/20",
      purple: "text-purple-500 border-purple-500/30 bg-purple-500/10 dark:bg-purple-900/30 shadow-purple-500/20",
      rose: "text-rose-500 border-rose-500/30 bg-rose-500/10 dark:bg-rose-900/30 shadow-rose-500/20",
      indigo: "text-indigo-500 border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-900/30 shadow-indigo-500/20",
    };
    return map[color] || map.orange;
  };

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center pt-20">

      {/* Floating Elements */}
      {floatingTags.map((tag, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }}
          transition={{ duration: 6 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: tag.delay }}
          className={`absolute ${tag.position} hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl shadow-xl z-20 ${getColorClasses(tag.color)} transition-colors`}
        >
          <tag.icon className="w-5 h-5" />
          <span className="text-sm font-bold tracking-wide text-white drop-shadow-md">{tag.text}</span>
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center z-30">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-[#020617]/40 backdrop-blur-md text-orange-400 text-sm font-bold uppercase tracking-wider mb-8 shadow-xl shadow-orange-500/10"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
          </span>
          Citizen First Initiative
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl sm:text-7xl lg:text-[6rem] font-bold tracking-tight mb-6 leading-tight drop-shadow-2xl"
        >
          <span className="block text-white">Smart City Management</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-500 animate-gradient-x font-outfit drop-shadow-sm">
            For the Future
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-4 max-w-2xl text-lg sm:text-2xl text-white mx-auto mb-10 leading-relaxed font-bold"
        >
          CivicPlus connects citizens directly with city departments. Report issues, track resolutions in real-time, and help build a better community together.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex justify-center gap-4 flex-col sm:flex-row items-center w-full sm:w-auto"
        >
          <Link to="/register" className="w-full sm:w-auto magnetic">
            <AnimatedButton variant="primary" className="w-full sm:w-auto px-10 py-5 text-lg shadow-2xl shadow-orange-500/20 ripple" icon={<ArrowRight className="w-5 h-5" />}>
              Get Started
            </AnimatedButton>
          </Link>
          <a href="#features" className="w-full sm:w-auto magnetic">
            <AnimatedButton variant="white" className="w-full sm:w-auto px-10 py-5 text-lg shadow-xl ripple">
              Explore Features
            </AnimatedButton>
          </a>
        </motion.div>
      </div>

    </section>
  );
}
