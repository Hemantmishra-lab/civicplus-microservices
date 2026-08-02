import React from 'react';
import { MessageSquareWarning, BarChart3, Bell, ShieldCheck, Map, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

const features = [
  {
    name: 'AI Complaint Categorization',
    description: 'Our smart system automatically categorizes your reports using machine learning, ensuring they reach the right department instantly.',
    icon: Smartphone,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10 border-orange-500/20'
  },
  {
    name: 'Real-Time Tracking',
    description: 'Track the exact status of your complaint with a transparent, step-by-step timeline view from submission to resolution.',
    icon: BarChart3,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10 border-rose-500/20'
  },
  {
    name: 'Location Detection & Geo Coding',
    description: 'Integrated Maps automatically detect your precise location and convert it into accurate geographic coordinates.',
    icon: Map,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10 border-indigo-500/20'
  },
  {
    name: 'Instant Notifications',
    description: 'Receive real-time push and email alerts the moment an officer updates, assigns, or resolves your reported issue.',
    icon: Bell,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    name: 'Dedicated Dashboards',
    description: 'Customized interfaces tailored for citizens to report issues and for department admins to manage workforce and analytics.',
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20'
  },
  {
    name: 'Easy Reporting',
    description: 'Snap a picture, add a description, and report potholes, streetlights, or waste management directly from your phone.',
    icon: MessageSquareWarning,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 z-20 overflow-hidden">
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <p className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-white font-outfit">
            Everything you need
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-200 font-medium">
            Our platform bridges the gap between citizens and city departments, making issue resolution transparent, automated, and efficient.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div variants={itemVariants} key={feature.name} className="h-full">
              <GlassCard hoverEffect={true} className="h-full group bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 p-8 shadow-xl">
                <div className={`inline-flex rounded-2xl p-4 border ${feature.bg} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-outfit tracking-wide">
                  {feature.name}
                </h3>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
