"use client";
import { useState } from "react";
import useStudioStore from "@/store/useStudioStore";
import { Trash2, RotateCcw, Box, Settings2, ChevronUp, ChevronDown } from "lucide-react";

const CUSTOMIZABLE_TYPES = [
  'dinette-seating', 'lagun-table', 'swivel-seat', 'bed-fixed',
  'sofa-bed', 'tall-wardrobe', 'engine-cushion', 'kitchen-galley',
  'overhead-locker'
];

const COLOR_PALETTE = [
  '#d97706', // Wood/Orange
  '#f3f4f6', // Light Gray
  '#4b5563', // Dark Gray
  '#1e3a8a', // Navy
  '#475569', // Slate
  '#fef3c7', // Cream
];

export default function ActiveModulePanel() {
  const [isMinimized, setIsMinimized] = useState(false);
  const {
    placedModules,
    activeModuleId,
    updateModuleColor,
    toggleModuleState,
    rotateModule,
    removeModule
  } = useStudioStore();

  if (!activeModuleId) return null;

  const mod = placedModules.find(m => m.id === activeModuleId);
  if (!mod) return null;

  return (
    <div className={`absolute top-24 left-4 z-20 w-64 bg-[#181a1d]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-3 flex flex-col text-sand transition-all duration-300 ${isMinimized ? 'opacity-50 hover:opacity-100 gap-0' : 'gap-3'}`}>
      <div className={`flex items-center gap-3 ${isMinimized ? '' : 'border-b border-white/10 pb-3'}`}>
        <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <Box size={16} className="text-terracotta" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider truncate">{mod.name}</h3>
          {!isMinimized && (
            <p className="text-[10px] text-sand/60 font-mono mt-0.5">
              {mod.dimensions[0]}m x {mod.dimensions[1]}m x {mod.dimensions[2]}m
            </p>
          )}
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-sand hover:text-white transition-colors border border-white/10"
        >
          {isMinimized ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="flex flex-col gap-3">
            {/* Toggle Modes */}
            {(() => {
              const secondState = mod.states?.find(s => s !== 'default');
              if (!secondState) return null;

              const stateKey = secondState === 'bed' ? 'isBedMode' : 'isOpen';
              const isActive = !!mod[stateKey];
              const actionLabel = secondState.charAt(0).toUpperCase() + secondState.slice(1);

              return (
                <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sand/80">Component State</span>
                  <button
                    onClick={() => toggleModuleState(mod.id, stateKey)}
                    className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-colors"
                  >
                    {isActive ? "Default" : actionLabel}
                  </button>
                </div>
              );
            })()}

            {/* Color Picker */}
            {((mod.parts && mod.parts.some(p => p.isColorable)) || CUSTOMIZABLE_TYPES.includes(mod.typeId)) && (
              <div className="flex flex-col gap-2 bg-white/5 p-2 rounded border border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sand/80 flex items-center gap-1.5">
                  <Settings2 size={12} /> Material Color
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {COLOR_PALETTE.map(color => (
                    <button
                      key={color}
                      onClick={() => updateModuleColor(mod.id, color)}
                      className={`w-5 h-5 rounded-full border-2 ${mod.color === color ? 'border-terracotta scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'} transition-all`}
                      style={{ backgroundColor: color }}
                      title={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1 border-t border-white/10">
            <button
              onClick={() => rotateModule(mod.id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-sand px-3 py-1.5 rounded border border-white/10 text-[10px] uppercase font-bold tracking-wider transition-colors"
            >
              <RotateCcw size={12} /> Rotate
            </button>
            <button
              onClick={() => removeModule(mod.id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded border border-red-500/20 text-[10px] uppercase font-bold tracking-wider transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
