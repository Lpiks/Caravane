"use client";
import { useState } from "react";
import useVehicleStore from "@/store/useVehicleStore";
import { Lightbulb, LightbulbOff, Sun, Sunset, Moon, Sliders, X } from "lucide-react";

export default function ShowroomControls() {
  const { headlightsOn, toggleHeadlights, ambientEnvironment, setEnvironment } = useVehicleStore();
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);

  const environments = [
    { id: 'sahara-sunset', label: 'Sahara Sunset', icon: Sunset },
    { id: 'mediterranean-day', label: 'Mediterranean Day', icon: Sun },
    { id: 'campfire-night', label: 'Campfire Night', icon: Moon }
  ];

  const isNight = ambientEnvironment === 'campfire-night';
  const labelClass = isNight ? 'text-linen/70' : 'text-obsidian/50';

  return (
    <>
      {/* DESKTOP CONTROLS (md:flex) */}
      <div className="hidden md:flex fixed top-24 right-8 z-30 flex-col gap-6">
        {/* Headlights Toggle */}
        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest drop-shadow-sm transition-colors duration-1000 ${labelClass}`}>
            Lights
          </span>
          <button 
            onClick={toggleHeadlights}
            className={`p-4 rounded-full backdrop-blur-md shadow-lg border transition-all duration-300 ${
              headlightsOn 
                ? 'bg-oasis text-linen border-oasis/50 shadow-oasis/20' 
                : 'bg-white/40 text-obsidian border-white/50 hover:bg-white/60'
            }`}
          >
            {headlightsOn ? <Lightbulb size={24} /> : <LightbulbOff size={24} />}
          </button>
        </div>

        {/* Environment Theme Switcher */}
        <div className="flex flex-col items-end gap-2 mt-4">
          <span className={`text-xs font-bold uppercase tracking-widest drop-shadow-sm transition-colors duration-1000 ${labelClass}`}>
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
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-obsidian text-linen shadow-md'
                      : 'text-obsidian/60 hover:bg-white/50 hover:text-obsidian'
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE COMPACT FLOATING CONTROLS (< 768px) */}
      <div className="md:hidden fixed top-20 right-4 z-30 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsMobileControlsOpen(!isMobileControlsOpen)}
          className="p-3 rounded-full bg-obsidian/80 backdrop-blur-md text-white border border-white/20 shadow-xl flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          {isMobileControlsOpen ? <X size={18} /> : <Sliders size={18} />}
          <span className="text-[10px] font-bold uppercase tracking-widest pr-1">Controls</span>
        </button>

        {isMobileControlsOpen && (
          <div className="flex flex-col gap-3 p-3 bg-obsidian/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Mobile Headlights */}
            <button
              onClick={toggleHeadlights}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
                headlightsOn ? 'bg-terracotta text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {headlightsOn ? <Lightbulb size={16} /> : <LightbulbOff size={16} />}
              <span>{headlightsOn ? 'Headlights ON' : 'Headlights OFF'}</span>
            </button>

            {/* Mobile Environment */}
            <div className="flex gap-1.5 pt-1 border-t border-white/10">
              {environments.map((env) => {
                const Icon = env.icon;
                const isActive = ambientEnvironment === env.id;
                return (
                  <button
                    key={env.id}
                    onClick={() => setEnvironment(env.id)}
                    title={env.label}
                    className={`flex-1 p-2.5 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-terracotta text-white shadow-md' : 'bg-white/10 text-white/60'
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
    </>
  );
}
