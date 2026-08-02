import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export default function Testimonials() {
  const testimonials = [
    { name: "Rahul S.", role: "Citizen", content: "I reported a broken streetlight and it was fixed the next day! The tracking feature is amazing.", rating: 5 },
    { name: "Priya M.", role: "Local Business Owner", content: "CivicPlus has made our neighborhood so much cleaner. Getting instant notifications on my phone makes me feel heard.", rating: 5 },
    { name: "Officer Sharma", role: "Sanitation Dept", content: "The analytics dashboard helps us allocate our workforce efficiently. We resolved 30% more issues this month.", rating: 5 },
    { name: "Amit K.", role: "Citizen", content: "Very easy to use. I snapped a photo of an open manhole, and within hours, someone came to inspect it.", rating: 4 },
    { name: "Neha R.", role: "Citizen", content: "I love the new interface. The dark mode is beautiful and the whole app feels incredibly fast.", rating: 5 },
  ];

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16 text-center">
        <h3 className="text-3xl sm:text-5xl font-bold text-white font-outfit">What People Say</h3>
      </div>

      {/* Marquee Wrapper */}
      <div className="flex w-full overflow-hidden group">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 px-3"
        >
          {/* Double the array for seamless infinite scroll */}
          {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
            <GlassCard key={idx} className="w-80 shrink-0 p-8 flex flex-col justify-between bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-white/10 shadow-xl">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">"{t.content}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold font-outfit text-lg shadow-inner">
                  {t.name[0]}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h5>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.role}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>

      {/* Side Gradients for fading edges */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10" />
    </section>
  );
}
