"use client";
import useVehicleStore from "@/store/useVehicleStore";
import { Car, Bus } from "lucide-react";

export default function VehicleSwitcherBar() {
  const { selectedVehicle, setVehicle } = useVehicleStore();

  const vehicles = [
    { id: 'vw-t3', label: 'Compact', fullLabel: 'Compact Class', icon: Car },
    { id: 'renault-master', label: 'Standard', fullLabel: 'Standard Class', icon: Bus },
    { id: 'toyota-coaster', label: 'Maxi Bus', fullLabel: 'Maxi Bus Class', icon: Bus }
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-[92vw]">
      <div className="flex bg-obsidian/85 backdrop-blur-xl p-1.5 sm:p-2 rounded-full shadow-2xl border border-sand/20">
        {vehicles.map((v) => {
          const Icon = v.icon;
          const isActive = selectedVehicle === v.id;
          
          return (
            <button
              key={v.id}
              onClick={() => setVehicle(v.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive 
                  ? 'bg-terracotta text-linen shadow-lg scale-105' 
                  : 'text-sand/70 hover:text-sand hover:bg-sand/10'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="inline md:hidden">{v.label}</span>
              <span className="hidden md:inline">{v.fullLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
