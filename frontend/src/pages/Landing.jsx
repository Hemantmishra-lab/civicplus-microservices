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
import FloatingVideoCard from '../components/ui/FloatingVideoCard';
import FloatingNav from '../components/ui/FloatingNav';

export default function Landing() {
  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white transition-colors duration-500 font-inter selection:bg-orange-500/30">
      
      {/* Global Cinematic Background */}
      <SmartCityBackground />
      
      <Navbar />
      
      <main className="relative z-10 w-full flex flex-col">
        <Hero />
        
        {/* Placeholder for FloatingVideoCard to dock into */}
        <div id="video-dock-target" className="relative z-20 w-full max-w-5xl mx-auto h-[50vh] md:h-[70vh] my-24 rounded-2xl" />
        
        <About />
        <Features />
        <HowItWorks />
        <Statistics />
        <Testimonials />
        <FAQ />
      </main>
      
      <Footer />
      <FloatingVideoCard />
      <FloatingNav />
    </div>
  );
}
