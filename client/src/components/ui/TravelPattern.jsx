import React from 'react';
import { Mountain, Tent, TreePine, Compass, Map, Flame, Wind, Sun, Moon, Truck, MapPin, Navigation } from 'lucide-react';

export default function TravelPattern() {
  const icons = [Mountain, Tent, TreePine, Compass, Map, Flame, Wind, Sun, Moon, Truck, MapPin, Navigation];
  
  // Generate a large grid of icons
  const gridRows = 20;
  const gridCols = 40;
  
  const cells = [];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      // Pick a deterministic icon based on position so it stays consistent
      const Icon = icons[(r * 7 + c * 11) % icons.length];
      cells.push(
        <div key={`${r}-${c}`} className="flex items-center justify-center w-16 h-16">
          <Icon size={20} strokeWidth={1.5} opacity={0.6} />
        </div>
      );
    }
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 mix-blend-multiply">
      {/* Pattern Grid - Rotated slightly for a luxury monogram aesthetic */}
      <div className="absolute inset-0 w-[150vw] h-[150vh] flex flex-wrap -ml-24 -mt-24 text-terracotta transform -rotate-3 scale-105">
        {cells}
      </div>
    </div>
  );
}
