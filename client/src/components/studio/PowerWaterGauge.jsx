"use client";
// Force hot reload for dark mode text
import useStudioStore from "@/store/useStudioStore";
import { Sun, Droplets, Weight, BatteryCharging, Waves, Thermometer, Users, Wrench } from "lucide-react";

export default function PowerWaterGauge() {
  const { getTotals } = useStudioStore();
  const totals = getTotals();

  // Define logical maximums for the progress bars
  const MAX_SOLAR = 800; // W
  const MAX_BATTERY = 800; // Ah
  const MAX_WATER = 200; // L
  const MAX_WEIGHT = 1000; // kg payload limit

  const solarPercent = Math.min((totals.solar / MAX_SOLAR) * 100, 100);
  const batteryPercent = Math.min((totals.battery / MAX_BATTERY) * 100, 100);
  const waterPercent = Math.min((totals.water / MAX_WATER) * 100, 100);
  const weightPercent = Math.min((totals.weight / MAX_WEIGHT) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* POWER & ENERGY */}
      <div className="p-5 bg-white/5 rounded-xl border border-white/10 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">⚡ Power & Energy</h3>
        
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-wider">
              <BatteryCharging size={14} className="text-yellow-500" /> Battery Bank
            </div>
            <span className="font-mono text-yellow-500 font-bold text-sm">{totals.battery}Ah</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 transition-all duration-500 ease-out" style={{ width: `${batteryPercent}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-1.5">
            <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-wider">
              <Sun size={14} className="text-terracotta" /> Solar Intake
            </div>
            <span className="font-mono text-terracotta font-bold text-sm">{totals.solar}W</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-terracotta transition-all duration-500 ease-out" style={{ width: `${solarPercent}%` }} />
          </div>
        </div>
      </div>

      {/* PLUMBING & CLIMATE */}
      <div className="p-5 bg-white/5 rounded-xl border border-white/10 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">💧 Plumbing & Climate</h3>
        
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-wider">
              <Droplets size={14} className="text-blue-400" /> Fresh Water
            </div>
            <span className="font-mono text-blue-400 font-bold text-sm">{totals.water}L</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${waterPercent}%` }} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/70 font-bold text-xs uppercase tracking-wider">
            <Waves size={14} /> Grey Water
          </div>
          <span className="font-mono text-white/90 font-bold text-sm">{totals.greyWater}L</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-white/70 font-bold text-xs uppercase tracking-wider">
            <Thermometer size={14} /> Winterization
          </div>
          <span className="text-xs font-bold uppercase bg-white/10 text-white/90 px-2 py-0.5 rounded-sm">
            {totals.winterizationLevel}
          </span>
        </div>
      </div>

      {/* ENGINEERING */}
      <div className="p-5 bg-white/5 rounded-xl border border-white/10 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">⚖️ Engineering</h3>
        
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-wider">
              <Weight size={14} className="text-emerald-400" /> Est. Payload
            </div>
            <span className="font-mono text-emerald-400 font-bold text-sm">{totals.weight}kg</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${weightPercent}%` }} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/70 font-bold text-xs uppercase tracking-wider">
            <Users size={14} /> Capacity
          </div>
          <span className="font-mono text-white/90 font-bold text-sm">
            {totals.sleeps > 0 ? `Sleeps ${totals.sleeps}` : 'Sleeps 0'} | {totals.seats > 0 ? `Seats ${totals.seats}` : 'Seats 0'}
          </span>
        </div>

        <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg mt-2">
          <div className="flex items-center gap-2 text-white/90 font-bold text-xs uppercase tracking-wider">
            <Wrench size={14} /> Build Complexity
          </div>
          <span className={`text-xs font-bold uppercase px-2 py-1 rounded-sm shadow-sm ${
            totals.complexity === 'Low' ? 'bg-emerald-900/50 text-emerald-400' :
            totals.complexity === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
            'bg-red-900/50 text-red-400'
          }`}>
            {totals.complexity}
          </span>
        </div>
      </div>

    </div>
  );
}
