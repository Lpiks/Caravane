import { useState, useEffect } from "react";
import useStudioStore from "@/store/useStudioStore";
import { Plus, ChevronLeft, Menu, X, PackagePlus } from "lucide-react";
import useComponentStore from "@/store/useComponentStore";

const getModuleCatalog = (activeChassis, customComponents = []) => {
  if (!customComponents || customComponents.length === 0) {
    return [{ category: "Custom Database", items: [] }];
  }

  const STUDIO_COLORS = {
    "kitchen-galley": "#9ca3af", "upright-fridge": "#d1d5db", "cooktop": "#0F172A",
    "gas-locker": "#EAB308", "shower-cabin": "#bae6fd", "cassette-toilet": "#f3f4f6",
    "grey-water-tank": "#334155", "dinette-seating": "#d97706", "lagun-table": "#b45309",
    "swivel-seat": "#475569", "bed-fixed": "#d97706", "sofa-bed": "#d97706",
    "tall-wardrobe": "#4b5563", "engine-cushion": "#f59e0b", "water-tank-120": "#0ea5e9",
    "battery-bank": "#eab308", "inverter-hub": "#1D4ED8", "diesel-heater": "#1E293B",
    "control-panel": "#06B6D4", "cargo-tray": "#64748B", "roof-ac": "#f8fafc",
    "maxxair-fan": "#1f2937", "solar-array-400": "#374151", "overhead-locker": "#9ca3af",
    "side-awning": "#94A3B8", "pop-top-roof": "#1E293B"
  };

  const groupedCategories = {};
  
  const legacyChassisMap = {
    't3': 'compact-classic',
    'l3h2': 'standard-highroof',
    'minibus': 'minibus-canvas'
  };

  const filteredComponents = customComponents.filter(c => {
    let compatible = c.compatibleChassis || [];
    if (compatible.length === 0) {
      if (!c.targetChassis || c.targetChassis === 'all') return true;
      return (legacyChassisMap[c.targetChassis] || c.targetChassis) === activeChassis;
    }
    const effectiveCompatible = [...compatible];
    if (effectiveCompatible.includes('minibus-canvas') && !effectiveCompatible.includes('maxi-bus')) {
      effectiveCompatible.push('maxi-bus');
    }
    return effectiveCompatible.includes(activeChassis);
  });

  filteredComponents.forEach(c => {
    const override = c.chassisOverrides?.[activeChassis] || {};
    const l = (override.l || c.defaultL || 100) / 100;
    const w = (override.w || c.defaultW || 100) / 100;
    const h = (override.h || c.defaultH || 100) / 100;

    let partColor = "#4b5563";
    if (c.parts && c.parts.length > 0) {
      const colorCounts = {};
      c.parts.forEach(p => {
        if (p.color) {
          colorCounts[p.color] = (colorCounts[p.color] || 0) + 1;
        }
      });

      let maxColor = null;
      let maxCount = 0;
      c.parts.forEach(p => {
        if (p.color) {
          const count = colorCounts[p.color];
          if (count > maxCount) {
            maxCount = count;
            maxColor = p.color;
          }
        }
      });

      partColor = maxColor || c.parts[0].color || "#4b5563";
    }

    const finalColor = c.color || STUDIO_COLORS[c.id] || partColor;
    const categoryName = c.category || "Uncategorized";

    if (!groupedCategories[categoryName]) {
      groupedCategories[categoryName] = [];
    }

    groupedCategories[categoryName].push({
      typeId: c.id,
      name: c.name,
      category: categoryName,
      dimensions: [l, h, w],
      layer: c.layer || 'furniture',
      defaultY: h / 2,
      color: finalColor,
      weightKg: c.weightKg || 20,
      parts: c.parts,
      defaultL: c.defaultL,
      defaultW: c.defaultW,
      defaultH: c.defaultH,
      chassisOverrides: c.chassisOverrides,
      states: c.states || ['default']
    });
  });

  return Object.keys(groupedCategories).map(catName => ({
    category: catName,
    items: groupedCategories[catName]
  }));
};

export default function ModuleSidebar3D({ isMobileOpen, onMobileClose }) {
  const { addModule3D, activeChassis } = useStudioStore();
  const { components: customComponents, fetchComponents } = useComponentStore();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const catalog = getModuleCatalog(activeChassis, customComponents);

  const handleAddModule = (item) => {
    addModule3D(item);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Wrapper (Desktop Left Panel + Mobile Bottom Sheet Drawer) */}
      <div className={`
        lg:static fixed inset-x-0 bottom-0 z-50 lg:z-20 lg:h-full bg-obsidian text-linen border-r border-white/10 shrink-0 transition-all duration-300 flex flex-col
        ${isMobileOpen 
          ? 'h-[80vh] rounded-t-3xl border-t border-white/20 shadow-2xl translate-y-0' 
          : 'translate-y-full lg:translate-y-0 lg:h-full'
        }
        ${isOpen ? 'lg:w-80' : 'lg:w-12'}
      `}>
        
        {/* Mobile Sheet Handle Header */}
        <div className="lg:hidden p-4 pb-2 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-white/20 rounded-full mx-auto" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-sand">Select Component</h2>
          </div>
          <button 
            onClick={onMobileClose}
            className="w-8 h-8 rounded-full bg-white/10 text-sand hover:text-white flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Desktop Expanded Content / Mobile Catalog Body */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'lg:opacity-0 lg:pointer-events-none lg:hidden'}`}>
          <div className="p-4 sm:p-6 pb-20 lg:w-80">
            <div className="hidden lg:flex justify-between items-center mb-6 pr-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-sand">Components</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-terracotta text-sand hover:text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {catalog.map((group, idx) => (
                <div key={idx}>
                  <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-linen/50 mb-3 border-b border-white/10 pb-2">
                    {group.category}
                  </h3>
                  <div className="space-y-2.5 sm:space-y-3">
                    {group.items.map((item) => (
                      <div key={item.typeId} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full shadow-inner border border-white/20 shrink-0" style={{ backgroundColor: item.color }}></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-linen leading-tight">{item.name}</span>
                            <span className="text-[9px] font-mono text-sand mt-1 uppercase">
                              {item.dimensions[0]}m x {item.dimensions[1]}m x {item.dimensions[2]}m
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAddModule(item)}
                          className="px-3 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-600 text-linen text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:scale-105 transition-transform shadow-md shrink-0 cursor-pointer min-h-[36px] min-w-[36px]"
                          title="Tap to Add to Van"
                        >
                          <PackagePlus size={14} />
                          <span className="text-[10px] sm:inline">Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Collapsed State */}
        {!isOpen && (
          <div 
            className="hidden lg:flex absolute inset-0 pt-6 flex-col items-center cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={20} className="text-sand/50 mt-2" />
            <div className="mt-24">
              <span className="rotate-[-90deg] block whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-sand/50">
                Components
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
