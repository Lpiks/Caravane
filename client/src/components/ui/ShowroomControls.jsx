"use client";
import { useState, useEffect } from "react";
import useVehicleStore from "@/store/useVehicleStore";
import { Lightbulb, LightbulbOff, Sun, Sunset, Moon, Sliders, X, ChevronDown, Car, Bus } from "lucide-react";

export default function ShowroomControls() {
  const { headlightsOn, toggleHeadlights, ambientEnvironment, setEnvironment, selectedVehicle, setVehicle } = useVehicleStore();
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Scroll listener to hide all controls when scrolling down to Section 1
  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (scrollContainer.scrollTop > 150) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
    };
    
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showControls) return null;

  const environments = [
    { id: 'sahara-sunset', label: 'Sahara Sunset', icon: Sunset },
    { id: 'mediterranean-day', label: 'Mediterranean Day', icon: Sun },
    { id: 'campfire-night', label: 'Campfire Night', icon: Moon }
  ];

  const vehicles = [
    { id: 'vw-t3', label: 'Compact', fullLabel: 'Compact Class', icon: Car },
    { id: 'promaster-136', label: 'Standard', fullLabel: 'Standard Class', icon: Bus },
    { id: 'snvi-100-v8', label: 'Luxury', fullLabel: 'Luxury Class', icon: Bus }
  ];

  const isNight = ambientEnvironment === 'campfire-night';
  const labelClass = isNight ? 'text-linen/70' : 'text-obsidian/50';

  return (
    <>
      {/* DESKTOP CONTROLS (md:flex) */}
      <div className="hidden md:flex fixed top-32 right-8 z-30 flex-col gap-5 items-end">

        {/* Headlights Toggle */}
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-widest drop-shadow-sm transition-colors duration-1000 ${labelClass}`}>
            Lights
          </span>
          <button
            onClick={toggleHeadlights}
            className={`p-3.5 rounded-full backdrop-blur-md shadow-lg border transition-all duration-300 hover:scale-105 active:scale-95 ${headlightsOn
              ? 'bg-oasis text-linen border-oasis/50 shadow-oasis/20'
              : 'bg-white/40 text-obsidian border-white/50 hover:bg-white/60'
              }`}
          >
            {headlightsOn ? <Lightbulb size={20} /> : <LightbulbOff size={20} />}
          </button>
        </div>

        {/* Environment Theme Switcher */}
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-widest drop-shadow-sm transition-colors duration-1000 ${labelClass}`}>
            Environment
          </span>
          <div className="flex flex-col bg-white/40 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/50 gap-2">
            {environments.map((env) => {
              const Icon = env.icon;
              const isActive = ambientEnvironment === env.id;
              return (
                <button
                  key={env.id}
                  onClick={() => setEnvironment(env.id)}
                  title={env.label}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-obsidian text-linen shadow-md'
                    : 'text-obsidian/60 hover:bg-white/50 hover:text-obsidian'
                    }`}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Vehicle Class Switcher (Styled exactly like Environment) */}
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-widest drop-shadow-sm transition-colors duration-1000 ${labelClass}`}>
            Class
          </span>
          <div className="flex flex-col bg-white/40 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/50 gap-2">
            {vehicles.map((v) => {
              const Icon = v.icon;
              const isActive = selectedVehicle === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setVehicle(v.id)}
                  title={v.fullLabel}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-terracotta text-white shadow-md'
                    : 'text-obsidian/60 hover:bg-white/50 hover:text-obsidian'
                    }`}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll Down button under the Versions button */}
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-widest drop-shadow-sm transition-colors duration-1000 ${labelClass}`}>
            Explore
          </span>
          <button
            onClick={() => {
              const about = document.getElementById('about-section');
              if (about) about.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-11 h-11 rounded-full bg-white/40 border border-white/50 hover:bg-terracotta hover:text-white text-obsidian backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center animate-bounce"
            title="Scroll Down"
          >
            <ChevronDown size={20} />
          </button>
        </div>

      </div>

      {/* MOBILE COMPACT FLOATING CONTROLS (< 768px) */}
      <div className="md:hidden fixed top-40 right-4 z-30 flex flex-col items-end gap-2.5">
        <button
          onClick={() => setIsMobileControlsOpen(!isMobileControlsOpen)}
          className="p-3 rounded-full bg-white/40 backdrop-blur-md text-obsidian border border-white/50 shadow-xl flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          {isMobileControlsOpen ? <X size={18} /> : <Sliders size={18} />}
          <span className="text-[10px] font-bold uppercase tracking-widest pr-1">Controls</span>
        </button>



        {isMobileControlsOpen && (
          <div className="flex flex-col gap-3 p-3 bg-obsidian/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Mobile Headlights */}
            <button
              onClick={toggleHeadlights}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${headlightsOn ? 'bg-terracotta text-white' : 'bg-white/10 text-white/70'
                }`}
            >
              {headlightsOn ? <Lightbulb size={16} /> : <LightbulbOff size={16} />}
              <span>{headlightsOn ? 'Lights ON' : 'Lights OFF'}</span>
            </button>

            {/* Mobile Environment Row */}
            <div className="flex gap-1.5 pt-2 border-t border-white/10">
              {environments.map((env) => {
                const Icon = env.icon;
                const isActive = ambientEnvironment === env.id;
                return (
                  <button
                    key={env.id}
                    onClick={() => setEnvironment(env.id)}
                    title={env.label}
                    className={`flex-1 p-2.5 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-terracotta text-white shadow-md' : 'bg-white/10 text-white/60'
                      }`}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Chassis Class Row */}
            <div className="flex gap-1.5 pt-2 border-t border-white/10">
              {vehicles.map((v) => {
                const Icon = v.icon;
                const isActive = selectedVehicle === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVehicle(v.id)}
                    title={v.fullLabel}
                    className={`flex-1 p-2.5 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-terracotta text-white shadow-md' : 'bg-white/10 text-white/60'
                      }`}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll Down Button (Mobile) - Exact right down side */}
      {!isMobileControlsOpen && (
        <button
          onClick={() => {
            const about = document.getElementById('about-section');
            if (about) about.scrollIntoView({ behavior: 'smooth' });
          }}
          className="md:hidden fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-obsidian flex items-center justify-center shadow-xl active:scale-95 transition-all hover:bg-terracotta hover:text-white hover:border-terracotta animate-bounce"
          title="Scroll Down"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </>
  );
}
