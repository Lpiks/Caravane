"use client";
import useStudioStore from "@/store/useStudioStore";
import { Eye, EyeOff } from "lucide-react";

export default function LayerToggleBar() {
  const { showRoof, showOverhead, showUnderbed, ghostBedTop, toggleLayerVisibility } = useStudioStore();

  const toggles = [
    { key: 'showRoof', label: 'Roof Solar' },
    { key: 'showOverhead', label: 'Overhead Lockers' },
    { key: 'showUnderbed', label: 'Under-Bed Storage' },
    { key: 'ghostBedTop', label: 'Ghost Mattress Mode' },
  ];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-obsidian/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex gap-4 shadow-xl overflow-x-auto w-max max-w-full">
      {toggles.map(t => {
        const isActive = 
          t.key === 'showRoof' ? showRoof :
          t.key === 'showOverhead' ? showOverhead :
          t.key === 'showUnderbed' ? showUnderbed :
          t.key === 'ghostBedTop' ? ghostBedTop : false;

        return (
          <button
            key={t.key}
            onClick={() => toggleLayerVisibility(t.key)}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              isActive ? 'bg-sand text-obsidian' : 'bg-transparent text-sand hover:bg-white/10'
            }`}
          >
            <span className="flex-shrink-0">
              {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
            </span>
            <span>{t.label}</span>
          </button>
        )
      })}
    </div>
  );
}
