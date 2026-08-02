import React from 'react';
import { motion } from 'framer-motion';

export default function Statistics() {
  const stats = [
    { value: "10,000+", label: "Complaints Solved" },
    { value: "98%", label: "Citizen Satisfaction" },
    { value: "24x7", label: "Active Support" },
    { value: "50+", label: "Departments Integrated" }
  ];

  return (
    <section className="relative py-20 z-20 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-slate-200 dark:divide-slate-800">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`text-center flex flex-col items-center justify-center ${idx % 2 === 0 ? 'pl-0' : ''}`}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-outfit tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-bold text-slate-300 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
