'use client';

import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { MapPin, Navigation, ArrowRight, X } from 'lucide-react';

const routes = [
  {
    id: "route-1",
    title: "The Sahara Crossing",
    terrain: "Desert / Dunes",
    description: "A grueling 1,200km stretch across the deep Saharan sands. Extreme temperatures and zero infrastructure demand maximum off-grid capability.",
    recommendedVan: "Maxi Explorer (4x4)",
    startPin: { x: "20%", y: "40%" },
    endPin: { x: "45%", y: "65%" },
    // A curvy SVG path string from start to end
    pathDef: "M 200,400 Q 300,350 350,500 T 450,650"
  },
  {
    id: "route-2",
    title: "Alpine Pass",
    terrain: "Mountain / Snow",
    description: "High altitude winding roads and sub-zero overnight temperatures. Requires heavy insulation, reliable heating, and agile handling.",
    recommendedVan: "The Stealth Sprinter",
    startPin: { x: "55%", y: "30%" },
    endPin: { x: "80%", y: "20%" },
    pathDef: "M 550,300 Q 600,200 700,250 T 800,200"
  },
  {
    id: "route-3",
    title: "Coastal Highway",
    terrain: "Paved / Coastal",
    description: "Endless ocean views with mild climates. Perfect for wide-open sliding doors and panoramic rooftop views.",
    recommendedVan: "Classic VW T3",
    startPin: { x: "30%", y: "80%" },
    endPin: { x: "70%", y: "85%" },
    pathDef: "M 300,800 Q 500,850 600,750 T 700,850"
  }
];

export default function InteractiveMap() {
  const [activeRoute, setActiveRoute] = useState(null);
  const pathsRef = useRef([]);

  useLayoutEffect(() => {
    // Initial animation for paths (hidden)
    pathsRef.current.forEach((path) => {
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
  }, []);

  useLayoutEffect(() => {
    // Animate the active route drawing itself
    if (activeRoute !== null) {
      const activePath = pathsRef.current[activeRoute];
      const length = activePath.getTotalLength();
      
      gsap.fromTo(activePath, 
        { strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }
      );
    }
  }, [activeRoute]);

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] bg-[#050505] overflow-hidden border-y border-white/5 font-sans">
      
      {/* Background Topo Lines (Abstract) */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 1000">
        <path d="M 0,200 Q 250,300 500,200 T 1000,300" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M 0,300 Q 300,400 600,300 T 1000,500" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M 0,400 Q 350,500 700,400 T 1000,700" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M 0,500 Q 400,600 800,500 T 1000,900" fill="none" stroke="#ffffff" strokeWidth="1" />
        <path d="M 0,600 Q 450,700 900,600 T 1000,1000" fill="none" stroke="#ffffff" strokeWidth="1" />
      </svg>

      {/* Interactive SVG Routes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        {routes.map((route, idx) => (
          <path
            key={route.id}
            ref={el => pathsRef.current[idx] = el}
            d={route.pathDef}
            fill="none"
            stroke={activeRoute === idx ? "#38bdf8" : "#334155"}
            strokeWidth={activeRoute === idx ? "4" : "2"}
            strokeLinecap="round"
            className="transition-colors duration-500"
            style={{ 
              filter: activeRoute === idx ? 'drop-shadow(0 0 8px rgba(56,189,248,0.6))' : 'none',
              opacity: activeRoute === null || activeRoute === idx ? 1 : 0.2
            }}
          />
        ))}
      </svg>

      {/* Map Pins */}
      {routes.map((route, idx) => (
        <React.Fragment key={route.id}>
          {/* Start Pin */}
          <button 
            onClick={() => setActiveRoute(idx)}
            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center transition-all duration-300 z-10 
              ${activeRoute === idx ? 'bg-sky-500 scale-125 shadow-[0_0_15px_rgba(56,189,248,0.8)]' : 'bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:scale-110'}
              ${activeRoute !== null && activeRoute !== idx ? 'opacity-30' : 'opacity-100'}
            `}
            style={{ left: route.startPin.x, top: route.startPin.y }}
          >
            <div className={`w-2 h-2 rounded-full ${activeRoute === idx ? 'bg-white' : 'bg-sky-400'}`} />
          </button>
          
          {/* End Pin (Only show if active) */}
          <div 
            className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-sky-400 transition-all duration-500 ease-out z-10 flex items-center justify-center
              ${activeRoute === idx ? 'opacity-100 scale-100 delay-1000' : 'opacity-0 scale-50'}
            `}
            style={{ left: route.endPin.x, top: route.endPin.y }}
          >
             <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
          </div>
        </React.Fragment>
      ))}

      {/* Glassmorphism Info Card */}
      <div 
        className={`absolute top-0 right-0 h-full w-full md:w-96 bg-zinc-950/80 backdrop-blur-2xl border-l border-white/10 p-8 transform transition-transform duration-700 ease-in-out z-20 flex flex-col justify-center
          ${activeRoute !== null ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {activeRoute !== null && (
          <>
            <button 
              onClick={() => setActiveRoute(null)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-widest text-xs mb-4">
              <MapPin size={14} />
              Route 0{activeRoute + 1}
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-2 leading-tight">
              {routes[activeRoute].title}
            </h2>
            
            <p className="text-sm text-slate-400 font-mono mb-8 border-l-2 border-sky-500 pl-3">
              {routes[activeRoute].terrain}
            </p>

            <p className="text-slate-300 leading-relaxed mb-10">
              {routes[activeRoute].description}
            </p>

            <div className="bg-sky-950/30 border border-sky-900/50 rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-xs text-sky-300/70 font-bold uppercase tracking-widest mb-1">Recommended Build</p>
              <p className="text-lg text-white font-medium flex items-center justify-between">
                {routes[activeRoute].recommendedVan}
                <ArrowRight size={18} className="text-sky-400 transform group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
