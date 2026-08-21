"use client";
import { useState, useRef, useEffect } from "react";
import { MoveHorizontal, Info, Thermometer, Zap, Droplets } from "lucide-react";

const HOTSPOTS = [
  { id: 1, x: 20, y: 30, icon: Thermometer, title: "Armaflex & Rockwool", desc: "Thermal Insulation — Built for Saharan heat & mountain cold." },
  { id: 2, x: 60, y: 70, icon: Zap, title: "Off-Grid Lithium System", desc: "12V/220V Victron Energy wiring setup for ultimate autonomy." },
  { id: 3, x: 80, y: 40, icon: Droplets, title: "Food-Grade Plumbing", desc: "PEX freshwater lines with isolated greywater drainage." },
];

export default function XRaySlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const onPointerUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    } else {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-12 flex flex-col gap-8">
      
      {/* Slider Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-video md:aspect-[21/9] bg-obsidian rounded-xl overflow-hidden shadow-2xl border-4 border-obsidian cursor-ew-resize select-none"
        onPointerDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX || (e.touches && e.touches[0].clientX));
        }}
      >
        
        {/* Layer A (Background): Raw Skeleton */}
        <div className="absolute inset-0 bg-[#22252a] flex flex-col items-end justify-center p-8 md:pr-16">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #ffffff15 1px, transparent 1px), linear-gradient(to bottom, #ffffff15 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <h3 className="text-4xl md:text-5xl font-bold text-linen/20 uppercase tracking-widest text-right">
            Structural Framing<br/>& 12V Wiring
          </h3>
          <p className="text-linen/40 font-mono mt-4 text-right max-w-sm z-10">
            High-grade insulation batts, aluminum sub-framing, and Victron Energy conduits exposed.
          </p>
        </div>

        {/* Hotspots (Only visible on Raw Skeleton side) */}
        {HOTSPOTS.map((hotspot) => (
          <div 
            key={hotspot.id}
            className="absolute z-20 pointer-events-auto"
            style={{ 
              left: `${hotspot.x}%`, 
              top: `${hotspot.y}%`,
              // Only show if the slider has revealed this hotspot
              opacity: sliderPosition > hotspot.x ? 1 : 0,
              pointerEvents: sliderPosition > hotspot.x ? 'auto' : 'none',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={() => setActiveHotspot(hotspot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
            onClick={(e) => {
              e.stopPropagation(); // prevent dragging slider
              setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id);
            }}
          >
            <button className="relative w-8 h-8 md:w-10 md:h-10 bg-terracotta text-linen rounded-full flex items-center justify-center shadow-lg hover:bg-terracotta/90 transition-colors z-10 group">
              <span className="absolute inset-0 rounded-full border-2 border-terracotta animate-ping opacity-75"></span>
              <Info size={20} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Tooltip */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 p-4 bg-linen text-obsidian rounded-md shadow-2xl border border-obsidian/10 transition-all duration-300 pointer-events-none ${
              activeHotspot === hotspot.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}>
              <div className="flex items-center gap-2 text-terracotta font-bold uppercase tracking-wider text-xs mb-2">
                <hotspot.icon size={14} />
                {hotspot.title}
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-80">{hotspot.desc}</p>
            </div>
          </div>
        ))}

        {/* Layer B (Foreground): Finished Interior */}
        <div 
          className="absolute inset-0 bg-[#e3cdb7] flex flex-col items-start justify-center p-8 md:pl-16 pointer-events-none transition-all duration-75 ease-out"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #181a1d 10px, #181a1d 20px)' }} />
          <h3 className="text-4xl md:text-5xl font-bold text-obsidian/30 uppercase tracking-widest text-left">
            Luxury Wood<br/>Finished Interior
          </h3>
          <p className="text-obsidian/50 font-mono mt-4 text-left max-w-sm z-10">
            Marine-grade plywood, CNC-milled cabinetry, and premium upholstery.
          </p>
        </div>

        {/* Draggable Divider Line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-30 pointer-events-none flex items-center justify-center transition-all duration-75 ease-out"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle */}
          <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-obsidian hover:scale-110 transition-transform cursor-ew-resize pointer-events-auto">
            <MoveHorizontal size={24} />
          </div>
        </div>

      </div>

      <p className="text-center text-sm font-mono text-sand/60 tracking-wider">
        Drag the slider to inspect what lives behind the walls. Tap hotspots for specs.
      </p>

    </div>
  );
}
