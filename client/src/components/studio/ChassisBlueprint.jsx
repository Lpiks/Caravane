import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useStudioStore from "@/store/useStudioStore";
import { X, ArrowRight, ArrowUp } from "lucide-react";

const CELL_SIZE = 20; // 20px per grid unit
const GRID_COLS = 12; // 12 cells wide (240px)
const GRID_ROWS = 24; // 24 cells high (480px)

export default function ChassisBlueprint() {
  const containerRef = useRef(null);
  const [dragState, setDragState] = useState({ id: null, x: 0, y: 0, valid: true });
  const { activeChassis, placedModules, moveModule, removeModule } = useStudioStore();

  // Basic visual representation for chassis bounds
  const getChassisHeight = () => {
    switch(activeChassis) {
      case 'compact-classic': return 16;
      case 'minibus-canvas': return 32;
      case 'standard-highroof':
      default: return 24;
    }
  };

  const currentRows = getChassisHeight();

  const checkCollision = (modId, x, y, width, length) => {
    return placedModules.some(other => {
      if (other.id === modId) return false;
      return !(x + width <= other.gridX || x >= other.gridX + other.width || y + length <= other.gridY || y >= other.gridY + other.length);
    });
  };

  const handleDrag = (e, info, mod) => {
    const currentPixelX = (mod.gridX * CELL_SIZE) + info.offset.x;
    const currentPixelY = (mod.gridY * CELL_SIZE) + info.offset.y;
    
    let snapX = Math.round(currentPixelX / CELL_SIZE);
    let snapY = Math.round(currentPixelY / CELL_SIZE);

    let outOfBounds = false;
    if (snapX < 0 || snapX + mod.width > GRID_COLS || snapY < 0 || snapY + mod.length > currentRows) {
      outOfBounds = true;
    }

    let clampX = Math.max(0, Math.min(snapX, GRID_COLS - mod.width));
    let clampY = Math.max(0, Math.min(snapY, currentRows - mod.length));

    const collides = checkCollision(mod.id, clampX, clampY, mod.width, mod.length);

    setDragState({
      id: mod.id,
      x: clampX,
      y: clampY,
      valid: !outOfBounds && !collides
    });
  };

  const handleDragEnd = (e, info, mod) => {
    setDragState({ id: null, x: 0, y: 0, valid: true });

    const currentPixelX = (mod.gridX * CELL_SIZE) + info.offset.x;
    const currentPixelY = (mod.gridY * CELL_SIZE) + info.offset.y;
    
    let snapX = Math.round(currentPixelX / CELL_SIZE);
    let snapY = Math.round(currentPixelY / CELL_SIZE);

    let clampX = Math.max(0, Math.min(snapX, GRID_COLS - mod.width));
    let clampY = Math.max(0, Math.min(snapY, currentRows - mod.length));

    if (!checkCollision(mod.id, clampX, clampY, mod.width, mod.length)) {
      moveModule(mod.id, clampX, clampY);
    }
  };

  return (
    <div 
      className="w-full max-h-[calc(100vh-180px)] h-[70vh] flex flex-col items-center justify-center py-6 overflow-hidden"
    >
      <div 
        className="flex flex-col items-center justify-center py-6"
        style={{ transform: 'scale(min(1, calc((100vh - 200px) / 850)))', transformOrigin: 'center center' }}
      >
        {/* Front End Label */}
        <p className="mb-6 text-obsidian/50 text-sm font-mono uppercase tracking-wider flex items-center gap-2">
          {activeChassis.replace('-', ' ')} • Front End <ArrowUp size={16} />
        </p>
        
        {/* Vehicle Silhouette Wrapper */}
        <div className="p-4 bg-white/40 border-4 border-obsidian/10 rounded-t-[40px] rounded-b-[10px] shadow-2xl relative mb-8">
          
          {/* Driver Cockpit Zone (Non-buildable) */}
          <div 
            className="w-full h-16 bg-obsidian/5 border-b-4 border-obsidian/20 rounded-t-[32px] flex items-center justify-center mb-1"
            style={{ width: GRID_COLS * CELL_SIZE }}
          >
            <span className="text-obsidian/30 font-bold uppercase tracking-widest text-xs">Driver Cabin</span>
          </div>

        {/* Blueprint Grid Container */}
        <div 
          ref={containerRef}
          className="relative bg-sand/20 rounded-b-md border-2 border-obsidian/20 shadow-inner overflow-hidden"
          style={{
            width: GRID_COLS * CELL_SIZE,
            height: currentRows * CELL_SIZE,
            backgroundImage: `linear-gradient(to right, #181A1D15 1px, transparent 1px), linear-gradient(to bottom, #181A1D15 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }}
        >
          {/* Render Placed Modules as draggable motion.divs */}
          {placedModules.map((mod) => (
            <motion.div
              key={mod.id}
              drag
              dragConstraints={containerRef}
              dragElastic={0.1}
              dragMomentum={false}
              onDrag={(e, info) => handleDrag(e, info, mod)}
              onDragEnd={(e, info) => handleDragEnd(e, info, mod)}
              className={`absolute flex items-center justify-center cursor-grab active:cursor-grabbing group ${mod.color} border border-terracotta/40 bg-sand/30 backdrop-blur-sm rounded-lg shadow-sm z-10`}
              style={{
                width: mod.width * CELL_SIZE,
                height: mod.length * CELL_SIZE,
                // The x, y props define the logical snapped origin
                x: mod.gridX * CELL_SIZE,
                y: mod.gridY * CELL_SIZE,
              }}
            >
              <span className="text-xs font-bold leading-tight select-none px-1 text-center truncate">
                {mod.name.split(' ')[0]}
              </span>
              
              {/* Delete button appears on hover */}
              <button 
                onClick={(e) => { e.stopPropagation(); removeModule(mod.id); }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow-md z-20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}

          {/* Ghost outline during drag */}
          {dragState.id && (
            <div 
              className={`absolute border-2 z-20 transition-colors pointer-events-none rounded-lg ${dragState.valid ? 'border-green-500 bg-green-500/20' : 'border-red-500 bg-red-500/20'}`}
              style={{
                width: placedModules.find(m => m.id === dragState.id)?.width * CELL_SIZE,
                height: placedModules.find(m => m.id === dragState.id)?.length * CELL_SIZE,
                left: dragState.x * CELL_SIZE,
                top: dragState.y * CELL_SIZE,
              }}
            />
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
