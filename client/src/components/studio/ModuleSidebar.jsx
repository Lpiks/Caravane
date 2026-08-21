"use client";
import useStudioStore from "@/store/useStudioStore";
import { Plus, Bed, Utensils, Bath, Sun, Droplets } from "lucide-react";

export const AVAILABLE_MODULES = [
  { typeId: 'bed-sofa', category: 'furniture', name: 'Folding Sofa Bed', width: 4, length: 6, solarWattage: 0, waterLiters: 0, weightKg: 80, color: 'bg-sand text-obsidian' },
  { typeId: 'bed-fixed', category: 'furniture', name: 'Fixed Rear Bed', width: 6, length: 6, solarWattage: 0, waterLiters: 0, weightKg: 60, color: 'bg-sand text-obsidian' },
  { typeId: 'kitchen-single', category: 'kitchen', name: 'Kitchenette + Gas', width: 2, length: 3, solarWattage: 0, waterLiters: 0, weightKg: 30, color: 'bg-terracotta text-linen' },
  { typeId: 'shower-wet', category: 'bathroom', name: 'Enclosed Wet Bath', width: 3, length: 3, solarWattage: 0, waterLiters: 0, weightKg: 45, color: 'bg-obsidian text-linen' },
  { typeId: 'solar-200w', category: 'solar', name: '200W Roof Solar', width: 3, length: 4, solarWattage: 200, waterLiters: 0, weightKg: 15, color: 'bg-oasis text-linen' },
  { typeId: 'solar-400w', category: 'solar', name: '400W Array', width: 6, length: 4, solarWattage: 400, waterLiters: 0, weightKg: 28, color: 'bg-oasis text-linen' },
  { typeId: 'water-60l', category: 'water', name: '60L Underbody Tank', width: 2, length: 2, solarWattage: 0, waterLiters: 60, weightKg: 65, color: 'bg-obsidian text-linen border border-sand/20' },
  { typeId: 'water-120l', category: 'water', name: '120L Off-Grid Tank', width: 3, length: 3, solarWattage: 0, waterLiters: 120, weightKg: 125, color: 'bg-obsidian text-linen border border-sand/20' }
];

const getCategoryIcon = (category) => {
  switch(category) {
    case 'furniture': return <Bed size={14} className="text-sand" />;
    case 'kitchen': return <Utensils size={14} className="text-terracotta" />;
    case 'bathroom': return <Bath size={14} className="text-obsidian" />;
    case 'solar': return <Sun size={14} className="text-oasis" />;
    case 'water': return <Droplets size={14} className="text-blue-400" />;
    default: return null;
  }
};

export default function ModuleSidebar() {
  const addModule = useStudioStore(state => state.addModule);

  return (
    <div className="w-full h-full bg-obsidian text-linen p-6 overflow-y-auto border-r border-sand/10">
      <h2 className="text-xl font-bold uppercase tracking-widest text-terracotta mb-6">Components</h2>
      
      <div className="flex flex-col gap-4">
        {AVAILABLE_MODULES.map((mod) => (
          <div 
            key={mod.typeId} 
            className="flex items-center justify-between p-3 bg-linen/5 rounded-md hover:bg-linen/10 transition-colors border border-sand/5 group"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 bg-obsidian/50 rounded-sm">
                {getCategoryIcon(mod.category)}
              </div>
              <div>
                <p className="font-bold text-sm text-sand group-hover:text-terracotta transition-colors">{mod.name}</p>
                <div className="flex gap-2 text-[10px] text-sand/60 font-mono mt-1">
                  <span>{mod.width}x{mod.length} Grid</span>
                {mod.solarWattage > 0 && <span className="text-oasis">+{mod.solarWattage}W</span>}
                {mod.waterLiters > 0 && <span className="text-blue-400">+{mod.waterLiters}L</span>}
              </div>
            </div>
            </div>
            
            <button 
              onClick={() => addModule(mod)}
              className="p-2 bg-terracotta/20 text-terracotta rounded-sm hover:bg-terracotta hover:text-linen transition-colors"
              title="Add to Blueprint"
            >
              <Plus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
