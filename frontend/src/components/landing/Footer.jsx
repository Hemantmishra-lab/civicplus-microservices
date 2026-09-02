import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    // Process subscription here (e.g., API call)

    // Show success message and clear input
    setIsSubmitted(true);
    setEmail('');

    // Optional: Hide the success message after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative z-10 border-t border-white/10 bg-[#020617]/60 backdrop-blur-3xl transition-colors duration-500 overflow-hidden"
    >
      {/* Background Aurora for Footer */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="32" height="32" viewBox="0 0 256 256" className="fill-orange-500" xmlns="http://www.w3.org/2000/svg">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
              <span className="text-white text-3xl font-black tracking-tight font-outfit">
                Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Plus</span>
              </span>
            </div>
            <p className="text-slate-300 max-w-md text-sm leading-relaxed font-medium">
              Transforming how citizens and city departments collaborate. Report issues, track progress, and build a better future together.
            </p>

            <div className="pt-4">
              <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Subscribe to Newsletter</h5>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-inner placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              {/* Success Message */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 mt-3 text-sm text-orange-400 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Thanks for subscribing!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Quick Links</h5>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li><a href="#about" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="#features" className="hover:text-orange-500 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-orange-500 transition-colors">How it Works</a></li>
              <li><a href="#faq" className="hover:text-orange-500 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contact</h5>
            <ul className="space-y-4 text-sm font-medium text-slate-300 mb-8">
              <li>support@civicplus.app</li>
              <li>1-800-CIVIC-APP</li>
              <li>123 Smart City Ave, Tech District</li>
            </ul>

            <div className="flex gap-4">
              {/* Twitter / X SVG Custom Clean Asset */}
              <a
                href="https://x.com/HemantMish39940"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-sm flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              {/* GitHub SVG Custom Clean Asset */}
              <a
                href="https://github.com/Hemantmishra-lab"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-sm flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </a>
              {/* LinkedIn SVG Custom Clean Asset */}
              <a
                href="https://www.linkedin.com/in/hemantmishra26/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-sm flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()} CivicPlus, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}