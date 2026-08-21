"use client";
import { useState, useEffect } from "react";
import useStudioStore from "@/store/useStudioStore";
import useChassisStore from "@/store/useChassisStore";
import { ArrowRight, Car, CheckCircle2, Loader2, X } from "lucide-react";

export default function VehicleSetupModal() {
  const { hasChosenVehicle, setVehicle, activeChassis, activeModelId, setHasChosenVehicle } = useStudioStore();
  const { fetchChassis, chassis, isLoading } = useChassisStore();
  
  // Local state for the setup process
  const [selectedClassId, setSelectedClassId] = useState(activeChassis || 'compact-classic');
  const [selectedModelId, setSelectedModelId] = useState(activeModelId || null);

  useEffect(() => {
    fetchChassis();
  }, [fetchChassis]);

  if (hasChosenVehicle) return null;

  const classMetadata = {
    'compact-classic': {
      name: 'Compact Class',
      description: 'Perfect for weekend getaways and agile driving.',
      imagePlaceholder: '🚐'
    },
    'standard-highroof': {
      name: 'Standard Class',
      description: 'The golden mean for full-time vanlife and comfort.',
      imagePlaceholder: '🚐'
    },
    'minibus-canvas': {
      name: 'Maxi Class',
      description: 'Maximum space for large families or luxury builds.',
      imagePlaceholder: '🚌'
    },
    'maxi-bus': {
      name: 'Maxi Bus Class',
      description: 'Heavy-duty large buses for custom multi-layered conversion builds.',
      imagePlaceholder: '🚌'
    }
  };

  const vehicleClasses = Object.entries(classMetadata).map(([classId, meta]) => {
    return {
      id: classId,
      ...meta,
      models: chassis
        .filter(c => c.class === classId)
        .map(c => ({
          id: c.id,
          name: c.name,
          details: c.details || '',
          specs: c.specs || {}
        }))
    };
  });

  const selectedClass = vehicleClasses.find(c => c.id === selectedClassId);

  const handleConfirm = () => {
    if (selectedClassId && selectedModelId) {
      setVehicle(selectedClassId, selectedModelId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/90 backdrop-blur-md px-3 sm:px-4 animate-in fade-in duration-300">
      
      {/* Premium Modal Container */}
      <div className="w-[96vw] max-w-5xl h-[88vh] sm:h-[80vh] bg-[#111216] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="p-4 sm:p-8 border-b border-white/5 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-linen tracking-tight">Configure Your Build</h2>
            <p className="text-xs sm:text-sm text-sand/60 mt-0.5 sm:mt-1">Select your base vehicle to enter the 3D Studio.</p>
          </div>
          {activeModelId && (
            <button 
              onClick={() => setHasChosenVehicle(true)}
              className="p-1 rounded-full hover:bg-white/5 text-sand hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Two-Column Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Left: Class Selection */}
          <div className="w-full md:w-1/3 bg-black/20 p-4 sm:p-8 border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto custom-scrollbar shrink-0 md:shrink">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-terracotta mb-3 sm:mb-6">1. Select Class</h3>
            
            <div className="flex md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 no-scrollbar snap-x">
              {vehicleClasses.map((vClass) => (
                <button
                  key={vClass.id}
                  onClick={() => {
                    setSelectedClassId(vClass.id);
                    setSelectedModelId(null); // Reset model when class changes
                  }}
                  className={`w-64 md:w-full shrink-0 snap-start text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                    selectedClassId === vClass.id 
                      ? 'bg-terracotta/10 border-terracotta/50 shadow-[0_0_20px_rgba(200,80,40,0.15)]' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 md:block">
                    <div className="text-3xl md:text-4xl md:mb-3 opacity-80 shrink-0">{vClass.imagePlaceholder}</div>
                    <div>
                      <h4 className={`text-sm sm:text-base font-bold uppercase tracking-wider md:mb-1 ${selectedClassId === vClass.id ? 'text-terracotta' : 'text-sand'}`}>
                        {vClass.name}
                      </h4>
                      <p className="hidden md:block text-xs text-sand/50 leading-relaxed">{vClass.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Model Selection */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar bg-gradient-to-br from-transparent to-black/30 min-h-0">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-terracotta mb-3 sm:mb-6">2. Select Model</h3>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 sm:py-20 text-sand/50 gap-3">
                <Loader2 className="animate-spin text-terracotta" size={28} />
                <p className="text-xs sm:text-sm font-semibold">Retrieving vehicle specifications...</p>
              </div>
            ) : selectedClass?.models.length === 0 ? (
              <div className="text-center py-10 sm:py-20 text-sand/40">
                <Car size={32} className="mx-auto mb-3 opacity-20" />
                <p>No models available for this class.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedClass?.models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`relative flex flex-col p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 h-32 sm:h-44 group ${
                      selectedModelId === model.id
                        ? 'bg-terracotta/10 border-terracotta/50 shadow-[0_0_30px_rgba(200,80,40,0.2)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Placeholder for DB image */}
                    <div className="flex-1 w-full flex items-center justify-center bg-black/20 rounded-lg mb-2 sm:mb-4 group-hover:bg-black/30 transition-colors">
                      <Car size={24} className={selectedModelId === model.id ? 'text-terracotta' : 'text-white/20'} />
                    </div>
                    
                    <div className="text-left w-full">
                      <h5 className={`font-bold uppercase tracking-wider text-xs sm:text-sm truncate ${selectedModelId === model.id ? 'text-terracotta' : 'text-sand'}`}>
                        {model.name}
                      </h5>
                      <p className="text-[9px] sm:text-[10px] text-sand/50 mt-0.5 sm:mt-1 truncate">{model.details}</p>
                    </div>

                    {selectedModelId === model.id && (
                      <div className="absolute top-3 right-3 text-terracotta animate-in zoom-in">
                        <CheckCircle2 size={16} className="fill-terracotta/20" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-white/5 shrink-0 flex justify-end bg-black/40">
          <button
            disabled={!selectedModelId}
            onClick={handleConfirm}
            className={`flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 ${
              selectedModelId 
                ? 'bg-terracotta hover:bg-[#A34322] text-linen shadow-[0_4px_20px_rgba(200,80,40,0.4)] hover:shadow-[0_4px_25px_rgba(200,80,40,0.6)] transform hover:-translate-y-0.5' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            Enter Studio
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
