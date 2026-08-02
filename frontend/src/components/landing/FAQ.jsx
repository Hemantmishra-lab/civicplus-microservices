import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "How do I report a complaint?",
      answer: "After logging in as a citizen, click on 'Report Issue' or 'File New Grievance' from your dashboard. Fill out the form, optionally auto-detect your location via GPS, attach any evidence, and submit. Your complaint will immediately be routed to the relevant department."
    },
    {
      question: "Can I track the status of my complaint?",
      answer: "Yes! CivicPlus features real-time tracking. Go to your dashboard and select a complaint to see its timeline, including when an officer accepts it, begins work, and finally resolves it."
    },
    {
      question: "Is my personal information visible to the public?",
      answer: "No, your personal information is strictly confidential. Only authorized government department administrators and assigned officers can view the details necessary to resolve your grievance."
    },
    {
      question: "What happens if an issue is not resolved in time?",
      answer: "CivicPlus has an automated escalation matrix. If a complaint remains unresolved past its stipulated timeframe, it is automatically escalated to higher authorities, and the citizen has a manual 'Escalate' option as well."
    },
    {
      question: "Can I upload photos or documents?",
      answer: "Absolutely. We encourage citizens to upload photos or PDF documents as evidence to help officers better understand and locate the issue."
    }
  ];

  return (
    <section id="faq" className="relative py-24 sm:py-32 z-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl sm:text-5xl font-bold text-white font-outfit mb-6">Frequently Asked</h3>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard 
                className={`overflow-hidden transition-all duration-300 cursor-pointer ${
                  activeIndex === index 
                    ? 'border-orange-500/50 shadow-orange-500/10 bg-white/60 dark:bg-slate-900/60' 
                    : 'hover:border-slate-300 dark:hover:border-slate-700 bg-white/30 dark:bg-slate-900/30'
                }`}
              >
                <div 
                  className="p-6 flex items-center justify-between"
                  onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                >
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-outfit pr-8">
                    {faq.question}
                  </h4>
                  <div className={`shrink-0 p-2 rounded-full transition-colors ${
                    activeIndex === index 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </div>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
