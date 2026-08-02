import React, { useState, useRef, useEffect } from 'react';
import { VolumeX, Volume2, X } from 'lucide-react';

export default function FloatingVideoCard() {
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isDocked, setIsDocked] = useState(false);
  const [dockStyles, setDockStyles] = useState({});
  const videoRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const target = document.getElementById('video-dock-target');
    if (!target) return;

    const updateStyles = () => {
      if (target) {
        setDockStyles({
          top: target.offsetTop + 'px',
          left: target.offsetLeft + 'px',
          width: target.offsetWidth + 'px',
          height: target.offsetHeight + 'px',
        });
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Dock when the target is at least 30% visible
        if (entry.isIntersecting) {
          updateStyles();
          setIsDocked(true);
        } else {
          setIsDocked(false);
        }
      },
      { threshold: 0.3 }
    );
    
    observer.observe(target);
    window.addEventListener('resize', updateStyles);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateStyles);
    };
  }, []);

  if (!isVisible) return null;

  // Floating PIP mode styles (bottom right)
  const defaultClasses = "fixed bottom-6 right-6 z-50 w-[380px] h-[214px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group hidden md:block scale-100 origin-bottom-right hover:scale-[1.02]";
  
  // Docked mode styles (expanded)
  const dockedClasses = "absolute z-40 bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group hidden md:block origin-center";

  return (
    <div 
      className={isDocked ? dockedClasses : defaultClasses}
      style={isDocked ? dockStyles : {}}
    >
      {!isDocked && (
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Close video"
        >
          <X size={16} />
        </button>
      )}
      
      <div className="relative w-full h-full cursor-pointer group/inner bg-slate-900 overflow-hidden">
        {/* The video itself will scale down slightly when docked to create a zoom effect */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDocked ? 'scale-100' : 'scale-110'}`}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.mastersunion.link/uploads/24042026/v1/thumbnail.webp"
        >
          <source src="https://files.mastersunion.link/uploads/25052026/v1/campusFilm.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-1000 ${isDocked ? 'opacity-100' : 'opacity-80'}`}
        />
        
        <div className={`absolute left-4 right-4 flex items-center justify-between transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDocked ? 'bottom-8 px-4' : 'bottom-4'}`}>
          <span 
            className={`text-white font-medium drop-shadow-md transition-all duration-1000 origin-left ${isDocked ? 'text-4xl scale-100' : 'text-sm scale-100'}`}
          >
            Explore our campus
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className={`flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-all duration-1000 ${isDocked ? 'p-4' : 'p-2'}`}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX size={isDocked ? 28 : 18} /> 
            ) : (
              <Volume2 size={isDocked ? 28 : 18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

