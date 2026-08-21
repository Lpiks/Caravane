"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, BatteryCharging, Droplets, ArrowRight } from "lucide-react";

const DESTINATIONS = [
  {
    id: 'bejaia',
    title: "Bejaia & Cap Carbon",
    subtitle: "Mediterranean Coastal Cliffs",
    color: "from-[#0284c7] to-[#0369a1]", 
    distance: "240 km",
    terrain: "Coastal / Damp",
    battery: "Standard 200Ah",
    water: "100L",
    tip: "High-humidity solar maintenance required near the coast."
  },
  {
    id: 'chrea',
    title: "Chréa National Park",
    subtitle: "Cedar Forests & Snow",
    color: "from-[#166534] to-[#14532d]", 
    distance: "70 km",
    terrain: "Alpine / Cold",
    battery: "Standard 200Ah",
    water: "60L",
    tip: "Diesel heater altitude calibration crucial above 1,500m."
  },
  {
    id: 'taghit',
    title: "Taghit Oasis",
    subtitle: "Saharan Sand Dunes",
    color: "from-[#d97706] to-[#b45309]", 
    distance: "1,100 km",
    terrain: "Desert / Extreme Heat",
    battery: "Upgraded 400Ah",
    water: "200L+",
    tip: "Maximize solar array tilt angle & frequently clear sand filters."
  },
  {
    id: 'tassili',
    title: "Tassili N'Ajjer",
    subtitle: "Plateau of the Giants",
    color: "from-[#991b1b] to-[#7f1d1d]", 
    distance: "1,900 km",
    terrain: "Deep Desert / Remote",
    battery: "Off-Grid Max 600Ah",
    water: "300L+",
    tip: "Long-range water storage & satellite navigation mandatory."
  }
];

export default function ParallaxRoadTrip() {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Since we have 4 identical 100vw slots, translating by -75% puts the 4th slot perfectly in view.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <div ref={targetRef} className="relative w-full h-[250vh] bg-obsidian">
      
      {/* Sticky Viewport Wrapper */}
      <div 
        className="sticky h-[calc(100vh-72px)] w-full overflow-hidden flex flex-col pt-0 pb-8 px-0 md:px-0"
        style={{ top: '72px' }}
      >
        
        {/* Header (Top) */}
        <div className="relative z-20 bg-[#181A1D]/90 backdrop-blur-md py-4 px-8 border-b border-white/10 flex flex-col md:items-start text-center md:text-left drop-shadow-xl shrink-0 w-full">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-sand mb-2">
            Algerian Expeditions
          </h1>
          <p className="text-xs md:text-sm font-medium text-linen/70 max-w-xl uppercase tracking-wider font-mono">
            From the Mediterranean cliffs to the deep Saharan dunes.<br className="hidden md:block"/> Built in Chéraga, proven across the nation.
          </p>
        </div>

        {/* Floating Horizontal Track */}
        <div className="flex-1 min-h-0 flex items-center w-full mt-4">
          <motion.div style={{ x }} className="flex w-[400vw] h-full items-center">
            {DESTINATIONS.map((dest) => (
              // 100vw slot ensures each card centers perfectly and math adds up to exactly 400vw
              <div key={dest.id} className="w-screen flex items-center justify-center shrink-0 h-full">
                <DestinationCard dest={dest} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress Bar (Bottom) */}
        <div className="z-20 w-full max-w-md mx-auto mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden shrink-0">
          <motion.div 
            className="h-full bg-sand" 
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }} 
          />
        </div>

      </div>
    </div>
  );
}

function DestinationCard({ dest }) {
  return (
    <div className={`relative w-[80vw] max-w-3xl h-[55vh] rounded-3xl shrink-0 mx-6 p-8 relative shadow-2xl overflow-hidden border border-white/10 flex flex-col justify-between bg-gradient-to-br ${dest.color}`}>
      
      {/* Abstract Texture Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>

      {/* Inner Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center z-10 w-full overflow-y-auto no-scrollbar h-full py-2">
        
        {/* Left Column: Title & Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sand/90 uppercase tracking-widest font-bold text-xs md:text-sm">
            <MapPin size={16} /> {dest.terrain}
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter drop-shadow-lg leading-[0.9] text-linen">
            {dest.title}
          </h2>
          
          <h3 className="text-lg md:text-2xl text-sand font-medium font-serif italic drop-shadow-md">
            {dest.subtitle}
          </h3>
          
          <div className="mt-4 bg-obsidian/30 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg max-w-md">
            <p className="text-sm md:text-base font-medium leading-relaxed text-linen/90">
              <span className="text-sand font-bold">PRO TIP:</span> {dest.tip}
            </p>
          </div>
        </div>

        {/* Right Column: Specs Card */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-6 border border-white/10 shadow-xl h-fit max-w-sm ml-auto mr-auto lg:mr-0 w-full">
          <h4 className="text-xs font-bold uppercase tracking-widest text-sand/60 border-b border-white/10 pb-3">
            Build Requirements
          </h4>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-bold text-linen/70 flex items-center gap-2">
                <MapPin size={14} className="text-terracotta"/> Distance
              </span>
              <span className="font-mono text-sand font-bold text-lg">{dest.distance}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-bold text-linen/70 flex items-center gap-2">
                <BatteryCharging size={14} className="text-oasis"/> Power
              </span>
              <span className="font-mono text-sand font-bold text-lg">{dest.battery}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-bold text-linen/70 flex items-center gap-2">
                <Droplets size={14} className="text-blue-400"/> Water
              </span>
              <span className="font-mono text-sand font-bold text-lg">{dest.water}</span>
            </div>
          </div>

          <button className="mt-2 w-full py-3 bg-linen text-obsidian rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-terracotta hover:text-linen transition-colors flex items-center justify-center gap-2 group">
            Route Summary <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
