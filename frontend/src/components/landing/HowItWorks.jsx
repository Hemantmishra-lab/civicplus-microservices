import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UserPlus, Edit3, UserCheck, Hammer, CheckCircle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export default function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    { icon: UserPlus, title: "Register", desc: "Create an account as a citizen or login to an existing one.", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/30" },
    { icon: Edit3, title: "Report Complaint", desc: "Submit your issue with photos, description, and location.", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/30" },
    { icon: UserCheck, title: "Complaint Assigned", desc: "The system routes your issue to the correct department.", color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/30" },
    { icon: Hammer, title: "Work Started", desc: "Officers arrive at the location and begin resolving the issue.", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/30" },
    { icon: CheckCircle, title: "Issue Resolved", desc: "You receive a notification that your city is better than before.", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30" }
  ];

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 z-20" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h3 className="text-3xl sm:text-5xl font-bold text-white font-outfit mb-6">How It Works</h3>
        </motion.div>

        <div className="relative">
          {/* Timeline Line Background */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 rounded-full hidden sm:block" />
          
          {/* Animated Timeline Line */}
          <motion.div 
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-gradient-to-b from-orange-500 via-rose-500 to-indigo-500 -translate-x-1/2 rounded-full hidden sm:block z-0"
            style={{ height: lineHeight }}
          />

          <div className="space-y-12 sm:space-y-24">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className={`relative flex flex-col sm:flex-row items-center gap-8 ${index % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}
              >
                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full border-4 border-slate-50 dark:border-[#020617] bg-white dark:bg-slate-900 shadow-xl z-10 hidden sm:flex">
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>

                {/* Content Card */}
                <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:pr-16 text-left sm:text-right' : 'sm:pl-16 text-left'}`}>
                  <GlassCard hoverEffect={true} className="p-6 md:p-8 bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-white/10 shadow-xl">
                    <div className={`inline-flex rounded-xl p-3 border ${step.bg} mb-4 sm:hidden`}>
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Step {index + 1}</span>
                    <h4 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 font-outfit">{step.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
