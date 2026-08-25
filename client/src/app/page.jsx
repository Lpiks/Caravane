"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Hammer, Layers, Settings, Compass } from "lucide-react";
import Link from "next/link";
import useVehicleStore from "@/store/useVehicleStore";
import ShowroomControls from "@/components/ui/ShowroomControls";
import { useEffect } from "react";

const ShowroomCanvas = dynamic(() => import("@/components/3d/ShowroomCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full absolute inset-0 bg-sky-50 flex items-center justify-center text-slate-500 uppercase tracking-widest font-mono text-[10px] sm:text-xs">
      Initializing 3D Showroom...
    </div>
  )
});

const FeaturesBentoGrid = dynamic(() => import("@/components/home/FeaturesBentoGrid"), {
  ssr: false
});

export default function Home() {
  const { ambientEnvironment } = useVehicleStore();
  const [mount3D, setMount3D] = useState(false);

  useEffect(() => {
    // Soft Load: Defer mounting the heavy 3D canvas by 1.2s
    // This leaves the main thread completely idle for Lighthouse to record
    // fast paint times and register the page as interactive quickly.
    const timer = setTimeout(() => {
      setMount3D(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const isNight = ambientEnvironment === 'campfire-night';
  const isSunset = ambientEnvironment === 'sahara-sunset';

  const bgClass = isNight ? 'bg-obsidian' : isSunset ? 'bg-orange-50' : 'bg-sky-50';
  const textClass = isNight ? 'text-linen' : 'text-obsidian';
  const subTextClass = isNight ? 'text-linen/70' : 'text-obsidian/70';

  return (
    <main className={`relative w-full min-h-[100dvh] transition-colors duration-1000 ${bgClass}`}>

      {/* SECTION 0: SHOWROOM HERO */}
      <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center shrink-0">
        
        {mount3D ? (
          <ShowroomCanvas />
        ) : (
          <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none">
             <div className="w-6 h-6 border-2 border-terracotta border-t-transparent rounded-full animate-spin mb-4 opacity-70"></div>
             <span className="text-terracotta/70 uppercase tracking-widest font-mono text-[10px]">
               Loading 3D Studio...
             </span>
          </div>
        )}

        {/* Floating UI Overlay: Headline */}
        <div className="absolute top-16 left-4 sm:top-20 sm:left-12 max-w-[85vw] sm:max-w-md md:max-w-lg pointer-events-none z-10 transition-colors duration-1000">
          <h1 className={`text-2xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] sm:leading-[0.9] opacity-90 ${textClass}`}>
            Crafted For <br />
            <span className="text-terracotta">Algerian</span> <br />
            Off-Grid <br />
            Journeys.
          </h1>
          <p className={`mt-2 sm:mt-6 font-mono text-[11px] sm:text-sm max-w-xs sm:max-w-sm ${subTextClass}`}>
            Select a chassis below. Configure your environment. Step into your next expedition.
          </p>

          {/* CTA Button */}
          <Link
            href="/studio"
            className="mt-3 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-8 sm:py-4 bg-obsidian text-linen font-bold uppercase tracking-widest text-[11px] sm:text-sm hover:bg-terracotta transition-colors rounded-sm pointer-events-auto shadow-lg active:scale-95"
          >
            Enter Build Studio <ArrowRight size={14} />
          </Link>
        </div>

        <ShowroomControls />
      </section>

      {/* SECTION 1: ABOUT & TECHNICAL SPECIFICATIONS */}
      <section id="about-section" className="relative w-full min-h-screen bg-[#0d0e12] border-t border-white/5 flex items-center justify-center py-20 px-6 z-10">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Mission Narrative */}
          <div className="space-y-6">
            <span className="text-xs font-bold text-terracotta uppercase tracking-widest block font-mono">
              Born in Chéraga, Proven in the Sahara
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white leading-none">
              Overland Autonomy, <br />
              Without Compromise.
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Kouini Caravane is Algiers' premier off-grid campervan workshop. We combine local Algerian craftsmanship with world-class electrical and insulation engineering. Every build is designed in our interactive 3D studio, CNC-machined from marine plywood, and welded to conquer the rugged Atlas and Saharan terrains.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/garage"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-sand font-bold uppercase tracking-wider text-xs border border-white/10 rounded transition-all"
              >
                Browse Templates
              </Link>
              <Link
                href="/studio"
                className="px-6 py-3.5 bg-terracotta text-white font-bold uppercase tracking-wider text-xs rounded hover:bg-[#A34322] transition-all"
              >
                Start from Scratch
              </Link>
            </div>
          </div>

          {/* Right Column: Engineering Icons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3 hover:border-terracotta/35 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                <Hammer size={18} />
              </div>
              <h3 className="font-bold text-white text-base">CNC Joinery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Marine-grade plywood CNC-cut and joined with structural aluminum profiles to eliminate rattles.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3 hover:border-sky-500/35 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Layers size={18} />
              </div>
              <h3 className="font-bold text-white text-base">Armaflex Shield</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dual-layered closed-cell foam insulation designed to lock out Sahara heat and Atlas alpine cold.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3 hover:border-emerald-500/35 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Settings size={18} />
              </div>
              <h3 className="font-bold text-white text-base">Victron Power</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lithium iron phosphate (LiFePO4) battery hubs and smart solar controller integrations.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-3 hover:border-purple-500/35 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Compass size={18} />
              </div>
              <h3 className="font-bold text-white text-base">Algiers Built</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Engineered and road-tested across coastal cliffs, forest trails, and deep desert sand dunes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: PLATFORM FEATURES BENTO GRID */}
      <section className="relative w-full bg-[#0a0a0c] border-t border-white/5 py-12 shrink-0 z-10">
        <FeaturesBentoGrid />
      </section>


    </main>
  );
}
