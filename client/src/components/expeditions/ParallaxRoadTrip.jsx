"use client";
import { useRef, useState } from "react";
import { MapPin, BatteryCharging, Droplets, Navigation, AlertTriangle, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";

const DESTINATIONS = [
  {
    id: 'bejaia',
    title: "Bejaia & Cap Carbon",
    subtitle: "Mediterranean Coastal Cliffs",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    distance: "240 km",
    terrain: "Coastal / Damp",
    battery: "200Ah",
    water: "100L",
    tip: "High-humidity solar maintenance required near the coast.",
    difficulty: 35, 
    isolation: 20
  },
  {
    id: 'chrea',
    title: "Chréa National Park",
    subtitle: "Cedar Forests & Snow",
    image: "https://images.unsplash.com/photo-1542601098-8fc114e148e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    distance: "70 km",
    terrain: "Alpine / Cold",
    battery: "200Ah",
    water: "60L",
    tip: "Diesel heater altitude calibration crucial above 1,500m.",
    difficulty: 55,
    isolation: 40
  },
  {
    id: 'taghit',
    title: "Taghit Oasis",
    subtitle: "Saharan Sand Dunes",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    distance: "1,100 km",
    terrain: "Desert / Extreme Heat",
    battery: "400Ah",
    water: "200L+",
    tip: "Maximize solar array tilt angle & frequently clear sand filters.",
    difficulty: 85,
    isolation: 70
  },
  {
    id: 'tassili',
    title: "Tassili N'Ajjer",
    subtitle: "Plateau of the Giants",
    image: "https://images.unsplash.com/photo-1549429737-0139b4b0870f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    distance: "1,900 km",
    terrain: "Deep Desert / Remote",
    battery: "600Ah",
    water: "300L+",
    tip: "Long-range water storage & satellite navigation mandatory.",
    difficulty: 98,
    isolation: 100
  }
];

export default function ParallaxRoadTrip() {
  const [scrollRatio, setScrollRatio] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollWidth <= clientWidth) {
      setScrollRatio(0);
      return;
    }
    const ratio = scrollLeft / (scrollWidth - clientWidth);
    setScrollRatio(ratio);
  };

  const scrollToSlide = (index) => {
    if (scrollContainerRef.current) {
      const slideWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
  };

  const currentSlideIndex = Math.round(scrollRatio * (DESTINATIONS.length - 1));

  return (
    <div className="relative w-full h-[100vh] min-h-[850px] bg-obsidian flex flex-col rounded-t-[2rem] overflow-hidden">
      
      {/* Dynamic Background Images */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {DESTINATIONS.map((dest, i) => {
          const targetRatio = i / (DESTINATIONS.length - 1);
          const distance = Math.abs(scrollRatio - targetRatio);
          const threshold = 1 / (DESTINATIONS.length - 1);
          // Fade opacity smoothly based on scroll
          const opacity = Math.max(0, 1 - (distance / threshold));
          
          return (
            <div
              key={dest.id}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-[10ms]"
              style={{
                backgroundImage: `url('${dest.image}')`,
                opacity: opacity
              }}
            >
              {/* Heavy dark gradient to keep it moody */}
              <div className="absolute inset-0 bg-obsidian/80 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/50" />
            </div>
          )
        })}
      </div>

      {/* Header (Top) */}
      <div className="relative z-20 bg-black/40 backdrop-blur-md pt-12 pb-8 px-8 border-b border-white/5 flex flex-col items-center md:items-start text-center md:text-left drop-shadow-2xl shrink-0 w-full">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-sand mb-2 drop-shadow-[0_0_15px_rgba(224,122,95,0.3)]">
          Expedition Dossiers
        </h1>
        <p className="text-xs md:text-sm font-medium text-linen/60 max-w-xl uppercase tracking-widest font-mono">
          Classified Environment Telemetry.<br className="hidden md:block"/> Engineered for absolute autonomy.
        </p>
      </div>

      {/* Slider Controls (Arrows) */}
      <div className="absolute inset-y-0 left-4 right-4 z-30 pointer-events-none flex items-center justify-between mt-[150px]">
        <button 
          onClick={() => scrollToSlide(currentSlideIndex - 1)}
          disabled={currentSlideIndex === 0}
          className="pointer-events-auto p-4 rounded-full bg-black/40 backdrop-blur-md text-sand border border-white/10 hover:bg-terracotta hover:text-obsidian transition-colors disabled:opacity-0"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={() => scrollToSlide(currentSlideIndex + 1)}
          disabled={currentSlideIndex === DESTINATIONS.length - 1}
          className="pointer-events-auto p-4 rounded-full bg-black/40 backdrop-blur-md text-sand border border-white/10 hover:bg-terracotta hover:text-obsidian transition-colors disabled:opacity-0"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Horizontal Snap Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="relative z-10 flex-1 w-full overflow-x-auto snap-x snap-mandatory no-scrollbar flex items-center"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DESTINATIONS.map((dest) => (
          <div key={dest.id} className="snap-center shrink-0 w-screen h-full max-h-[650px] flex items-center justify-center p-4 md:p-8">
            <MissionDossier dest={dest} />
          </div>
        ))}
      </div>

      {/* Telemetry Progress Bar (Bottom) */}
      <div className="z-20 w-full max-w-3xl mx-auto mb-8 px-8 flex flex-col gap-2 shrink-0">
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-mono text-sand/50">
          <span>Mission Progress</span>
          <span>SYS_ONLINE</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-terracotta shadow-[0_0_10px_rgba(224,122,95,0.8)] transition-all duration-300 ease-out" 
            style={{ width: `${Math.max(5, scrollRatio * 100)}%` }} 
          />
        </div>
      </div>

    </div>
  );
}

function MissionDossier({ dest }) {
  return (
    <div className="relative w-full max-w-5xl h-full rounded-xl shrink-0 mx-auto relative shadow-2xl overflow-hidden border border-white/10 flex flex-col bg-black/40 backdrop-blur-2xl">
      
      {/* Corner UI Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-terracotta/50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-terracotta/50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-terracotta/50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-terracotta/50" />

      {/* Inner Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full">
        
        {/* Left Column: Mission Title & Image */}
        <div className="relative p-8 md:p-12 flex flex-col justify-end border-b lg:border-b-0 lg:border-r border-white/10">
           {/* Background snippet for the left panel */}
           <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale mix-blend-luminosity pointer-events-none" style={{ backgroundImage: `url('${dest.image}')` }} />
           <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent" />
           
           <div className="relative z-10 flex flex-col gap-2">
             <div className="flex items-center gap-3 text-terracotta font-mono text-xs tracking-widest mb-4">
               <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
               TARGET: {dest.id.toUpperCase()}
             </div>
             
             <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-lg text-linen">
               {dest.title}
             </h2>
             
             <h3 className="text-sm md:text-lg text-sand/80 font-mono uppercase tracking-widest">
               {dest.subtitle}
             </h3>
             
             <div className="mt-8 border-l-2 border-terracotta/50 pl-4 py-1">
               <p className="text-xs md:text-sm font-mono text-linen/70 leading-relaxed uppercase">
                 <span className="text-terracotta">SYS_WARN:</span> {dest.tip}
               </p>
             </div>
           </div>
        </div>

        {/* Right Column: Telemetry & Specs */}
        <div className="p-8 md:p-12 flex flex-col gap-8 bg-black/20 overflow-y-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          <h4 className="text-xs font-bold uppercase tracking-widest text-sand/40 border-b border-white/5 pb-2 font-mono shrink-0">
            Vehicle Telemetry Requirements
          </h4>
          
          <div className="grid grid-cols-2 gap-6 shrink-0">
            <TelemetryMetric icon={MapPin} label="Distance" value={dest.distance} color="text-sand" />
            <TelemetryMetric icon={Navigation} label="Terrain" value={dest.terrain} color="text-linen" />
            <TelemetryMetric icon={BatteryCharging} label="Min. Power" value={dest.battery} color="text-terracotta" />
            <TelemetryMetric icon={Droplets} label="Min. Water" value={dest.water} color="text-[#0ea5e9]" />
          </div>

          <div className="mt-4 flex gap-6 border-t border-white/5 pt-6 shrink-0">
            <TelemetryRing label="Difficulty" percentage={dest.difficulty} color="#e07a5f" />
            <TelemetryRing label="Isolation" percentage={dest.isolation} color="#f4f1de" />
          </div>

          <button className="mt-auto w-full py-4 bg-transparent border border-terracotta/50 text-terracotta rounded-sm font-mono uppercase tracking-widest text-xs hover:bg-terracotta hover:text-obsidian transition-all flex items-center justify-center gap-3 group relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-terracotta translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
            <span className="relative z-10 flex items-center gap-2">Initialize Build Protocol <AlertTriangle size={14} className="group-hover:animate-bounce" /></span>
          </button>

        </div>

      </div>
    </div>
  );
}

function TelemetryMetric({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest font-mono text-white/40 flex items-center gap-2">
        <Icon size={12} className={color} /> {label}
      </span>
      <span className={`font-mono font-bold text-sm md:text-base tracking-wider ${color}`}>
        {value}
      </span>
    </div>
  );
}

function TelemetryRing({ label, percentage, color }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 64 64" className="transform -rotate-90 w-full h-full overflow-visible">
          <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
          <circle 
            cx="32" 
            cy="32" 
            r={radius} 
            stroke={color} 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-[10px] font-mono font-bold" style={{ color }}>{percentage}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">{label}</span>
        <span className="text-xs uppercase font-mono tracking-widest text-white/80">
          {percentage > 80 ? 'EXTREME' : percentage > 50 ? 'HIGH' : 'NOMINAL'}
        </span>
      </div>
    </div>
  );
}
