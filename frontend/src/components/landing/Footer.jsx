import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { AnimatedButton } from '../ui/AnimatedButton';

export default function Footer() {
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
              <div className="flex gap-2 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-inner placeholder-slate-400"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
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
              <a href="#" className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-sm">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-sm">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-sm">
                <Globe className="w-5 h-5" />
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
