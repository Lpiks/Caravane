"use client";

import { useState } from "react";
import ShowroomCanvas from "@/components/3d/ShowroomCanvas";
import GarageShowroom from "@/components/3d/GarageShowroom";
import FeaturesBentoGrid from "@/components/home/FeaturesBentoGrid";
import VehicleSwitcherBar from "@/components/ui/VehicleSwitcherBar";
import ShowroomControls from "@/components/ui/ShowroomControls";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import useVehicleStore from "@/store/useVehicleStore";

export default function Home() {
  const { ambientEnvironment } = useVehicleStore();
  const [currentSection, setCurrentSection] = useState(0);

  const isNight = ambientEnvironment === 'campfire-night';
  const isSunset = ambientEnvironment === 'sahara-sunset';

  const bgClass = isNight ? 'bg-obsidian' : isSunset ? 'bg-orange-50' : 'bg-sky-50';
  const textClass = isNight ? 'text-linen' : 'text-obsidian';
  const subTextClass = isNight ? 'text-linen/70' : 'text-obsidian/70';

  return (
    <main className={`relative w-full min-h-[100dvh] h-screen overflow-hidden transition-colors duration-1000 ${bgClass}`}>

      {/* Sliding Container */}
      <div
        className="w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: `translateY(-${currentSection * 100}%)` }}
      >

        {/* SECTION 0: SHOWROOM */}
        <section className="relative w-full h-full flex flex-col items-center justify-center">
          <ShowroomCanvas />

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
          <VehicleSwitcherBar />
        </section>

        {/* SECTION 1: GARAGE SHOWROOM */}
        <section className="relative w-full h-full bg-[#0a0a0c] border-t border-white/5">
          <GarageShowroom />
        </section>

        {/* SECTION 2: PLATFORM FEATURES BENTO GRID */}
        <section className="relative w-full h-full bg-[#0a0a0c] border-t border-white/5 overflow-y-auto custom-scrollbar">
          <FeaturesBentoGrid />
        </section>

      </div>

      {/* UNIVERSAL SECTION NAVIGATION CONTROLS (RIGHT SIDE VERTICAL STACK ON ALL SCREENS) */}
      <div className={`flex absolute right-3 sm:right-8 flex-col gap-2.5 sm:gap-4 z-40 transition-all duration-700 ease-in-out ${
        currentSection === 0 ? 'bottom-28 sm:bottom-8' : 'top-1/2 -translate-y-1/2'
      }`}>
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          className={`w-9 h-9 sm:w-12 sm:h-12 bg-obsidian/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-terracotta hover:text-white transition-all duration-300 shadow-2xl active:scale-95 ${
            currentSection === 0 ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
          title="Go Up to Previous Section"
        >
          <ChevronUp size={18} className="sm:w-5 sm:h-5" />
        </button>
        
        <button
          onClick={() => setCurrentSection(Math.min(2, currentSection + 1))}
          className={`w-9 h-9 sm:w-12 sm:h-12 bg-obsidian/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-terracotta hover:text-white transition-all duration-300 shadow-2xl active:scale-95 ${
            currentSection === 2 ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
          } ${currentSection === 0 ? 'animate-bounce text-terracotta border-terracotta/50' : ''}`}
          title="Go Down to Next Section"
        >
          <ChevronDown size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

    </main>
  );
}
