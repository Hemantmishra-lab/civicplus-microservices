import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Statistics from '../components/landing/Statistics';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';
import SmartCityBackground from '../components/ui/SmartCityBackground';
import FloatingNav from '../components/ui/FloatingNav';

export default function Landing() {
  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white transition-colors duration-500 font-inter selection:bg-orange-500/30">
      
      {/* Global Cinematic Background */}
      <SmartCityBackground />
      
      <Navbar />
      
      <main className="relative z-10 w-full flex flex-col">
        <Hero />
        
        <About />
        <Features />
        <HowItWorks />
        <Statistics />
        <Testimonials />
        <FAQ />
      </main>
      
      <Footer />
      <FloatingNav />
    </div>
  );
}
