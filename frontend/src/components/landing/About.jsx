import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, UploadCloud, BellRing, ClipboardCheck, BarChart4 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export default function About() {
  const citizenFeatures = [
    { icon: UploadCloud, title: 'Report & Upload Evidence', desc: 'Easily log issues and attach images or PDFs.' },
    { icon: BellRing, title: 'Real-time Notifications', desc: 'Get updates on your complaint status instantly.' },
    { icon: ClipboardCheck, title: 'Track Resolution', desc: 'Monitor the entire lifecycle of your grievance.' },
  ];

  const govFeatures = [
    { icon: Users, title: 'Receive & Assign', desc: 'Automatically route complaints to the right department.' },
    { icon: Building2, title: 'Manage Workforce', desc: 'Assign ground supervisors and track their progress.' },
    { icon: BarChart4, title: 'City Analytics', desc: 'Identify recurring issues and improve infrastructure.' },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h3 className="text-3xl sm:text-5xl font-bold text-white font-outfit mb-6">Bridging the Gap</h3>
          <p className="max-w-2xl mx-auto text-lg text-slate-200 leading-relaxed">
            CivicPlus is a modern Smart City Complaint Management platform designed to create seamless communication between citizens and government departments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          
          {/* Citizen Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl border border-orange-500/30">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="text-2xl font-bold text-white font-outfit">For Citizens</h4>
            </div>

            <div className="space-y-4">
              {citizenFeatures.map((feature, idx) => (
                <GlassCard hoverEffect={true} key={idx} className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <feature.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Government Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 mt-12 lg:mt-0"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl border border-blue-500/30">
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-2xl font-bold text-white font-outfit">For Departments</h4>
            </div>

            <div className="space-y-4">
              {govFeatures.map((feature, idx) => (
                <GlassCard hoverEffect={true} key={idx} className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
