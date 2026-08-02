import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { AnimatedButton } from '../ui/AnimatedButton';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 100 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:px-8 sm:py-5 transition-all duration-300 ${scrolled ? "bg-[#020617]/70 backdrop-blur-xl border-b border-white/10" : "bg-transparent border-transparent"
        }`}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.svg
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            width="28" height="28" viewBox="0 0 256 256"
            className="fill-orange-500" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </motion.svg>
          <span className="text-white text-2xl font-bold tracking-tight">Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Plus</span></span>
        </Link>
      </div>

      {/* Center pill */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-[#020617]/50 backdrop-blur-md border border-white/10 rounded-full p-1 items-center gap-1 shadow-inner">
        <a href="#about" className="relative px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all magnetic">
          About
        </a>
        <a href="#features" className="relative px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all magnetic">
          Features
        </a>
        <a href="#how-it-works" className="relative px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all magnetic">
          How it Works
        </a>
        <a href="#faq" className="relative px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all magnetic">
          FAQ
        </a>
        <div className="w-[1px] h-4 bg-slate-700 mx-2" />
        <Link to="/login" className="relative px-4 py-2 rounded-full text-sm font-bold text-orange-400 hover:bg-orange-500/10 transition-all magnetic">
          Log in
        </Link>
      </div>

      {/* Right: Theme Toggle & Sign Up */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-slate-300 hover:bg-white/10 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
        <div className="hidden md:block">
          <Link to="/register">
            <AnimatedButton variant="primary" className="py-2.5 px-6">
              Sign Up
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
