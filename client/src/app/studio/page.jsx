"use client";

import useStudioStore from "@/store/useStudioStore";
import ModuleSidebar3D from "@/components/studio/ModuleSidebar3D";
import StudioCanvas3D from "@/components/studio/StudioCanvas3D";
import PowerWaterGauge from "@/components/studio/PowerWaterGauge";
import SubmitDesignButton from "@/components/studio/SubmitDesignButton";
import { Settings, RefreshCcw, ChevronDown, ChevronRight, PackagePlus, Sliders, X } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useState, useEffect } from "react";
import axios from "axios";
import VehicleSetupModal from "@/components/studio/VehicleSetupModal";
import useChassisStore from "@/store/useChassisStore";

export default function Studio() {
  const { activeChassis, activeModelId, setHasChosenVehicle, clearStudio, loadTemplate, driveSide, setDriveSide } = useStudioStore();
  const { chassis } = useChassisStore();

  const activeDbChassis = chassis.find(c => c.id === activeModelId);

  const [isDriveSideOpen, setIsDriveSideOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [dbTemplates, setDbTemplates] = useState([]);

  // Mobile Drawer States
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false);
  const [isMobileSpecsOpen, setIsMobileSpecsOpen] = useState(false);

  useEffect(() => {
    if (activeModelId) {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      axios.get(`${API_BASE}/api/templates?chassisId=${activeModelId}`)
        .then(res => setDbTemplates(res.data))
        .catch(err => console.error("Error fetching templates", err));
    }
  }, [activeModelId]);

  // Body Scroll Locking for Mobile Drawers
  useEffect(() => {
    if (isMobileCatalogOpen || isMobileSpecsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileCatalogOpen, isMobileSpecsOpen]);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  const requestConfirm = (title, message, action) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        action();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="w-full min-h-[100dvh] h-screen bg-linen flex flex-col overflow-hidden relative">

      {/* Top Header & Chassis Tabs */}
      <div className="w-full bg-obsidian text-sand py-2.5 sm:py-4 px-3 sm:px-8 flex flex-wrap items-center justify-between border-b border-sand/20 shrink-0 gap-2 z-20">
        
        {/* Left: Logo & Model Selector */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sand shrink-0">
            <Settings size={18} className="text-terracotta" />
            <h1 className="text-base sm:text-xl font-bold uppercase tracking-widest">Build Studio</h1>
          </div>

          <ChevronRight size={14} className="text-white/20 shrink-0 hidden sm:block" />

          <button
            onClick={() => setHasChosenVehicle(false)}
            className="flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm bg-terracotta text-linen shadow-md transition-colors hover:bg-[#A34322] shrink-0"
          >
            {activeDbChassis ? activeDbChassis.name : 'SELECT MODEL'}
          </button>

          {activeDbChassis && (
            <div className="hidden lg:flex items-center gap-3 ml-2 border-l border-white/10 pl-4 text-[10px] font-mono tracking-widest text-sand/40 shrink-0">
              <span>L: {activeDbChassis.defaultL}cm</span>
              <span className="text-white/20">|</span>
              <span>H: {activeDbChassis.defaultH}cm</span>
            </div>
          )}
        </div>

        {/* Right: Controls & Presets */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Region Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDriveSideOpen(!isDriveSideOpen);
                setIsTemplateOpen(false);
              }}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md px-2.5 py-1 sm:px-3 sm:py-1.5 transition-colors text-xs"
            >
              <span className="hidden sm:inline text-[10px] uppercase text-sand/60 font-bold tracking-widest">Region:</span>
              <span className="font-bold uppercase tracking-wider text-terracotta">
                {driveSide === 'LHD' ? 'EU' : 'UK'}
              </span>
              <ChevronDown size={12} className={`text-sand/60 transition-transform ${isDriveSideOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDriveSideOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-[#181A1D] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-1 flex flex-col">
                  <button
                    onClick={() => { setDriveSide('LHD'); setIsDriveSideOpen(false); }}
                    className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider text-left transition-colors ${driveSide === 'LHD' ? 'bg-terracotta/20 text-terracotta' : 'text-sand hover:bg-white/5 hover:text-white'}`}
                  >
                    EU (LHD)
                  </button>
                  <button
                    onClick={() => { setDriveSide('RHD'); setIsDriveSideOpen(false); }}
                    className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider text-left transition-colors ${driveSide === 'RHD' ? 'bg-terracotta/20 text-terracotta' : 'text-sand hover:bg-white/5 hover:text-white'}`}
                  >
                    UK (RHD)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Load Template */}
          <div className="relative">
            <button
              onClick={() => {
                setIsTemplateOpen(!isTemplateOpen);
                setIsDriveSideOpen(false);
              }}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md px-2.5 py-1 sm:px-3 sm:py-1.5 transition-colors text-xs"
            >
              <span className="text-[10px] uppercase text-sand/60 font-bold tracking-widest">Templates</span>
              <ChevronDown size={12} className={`text-sand/60 transition-transform ${isTemplateOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTemplateOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[#181A1D] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-1 flex flex-col max-h-64 overflow-y-auto glass-scrollbar">
                  {dbTemplates.length === 0 ? (
                    <div className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-sand/40 text-center">
                      No Templates Available
                    </div>
                  ) : (
                    dbTemplates.map(tpl => (
                      <button
                        key={tpl._id || tpl.id}
                        onClick={() => {
                          setIsTemplateOpen(false);
                          requestConfirm(
                            "Load Template",
                            `Are you sure you want to load "${tpl.name}"? This will clear your current layout.`,
                            () => loadTemplate(tpl.modules)
                          );
                        }}
                        className="px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-left text-sand hover:bg-terracotta/80 hover:text-white transition-colors"
                      >
                        {tpl.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              requestConfirm(
                "Clear Studio",
                "Are you sure you want to permanently delete all components and clear the board?",
                () => clearStudio()
              );
            }}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sand/60 hover:text-terracotta transition-colors ml-1"
          >
            <RefreshCcw size={13} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left: Components Catalog (Desktop Sidebar + Mobile Bottom Drawer) */}
        <ModuleSidebar3D 
          isMobileOpen={isMobileCatalogOpen}
          onMobileClose={() => setIsMobileCatalogOpen(false)}
        />

        {/* Center: 3D Canvas */}
        <StudioCanvas3D />

        {/* Right: Build Specs Dashboard (Desktop Sidebar + Mobile Bottom Drawer) */}
        <div className={`
          lg:static fixed inset-x-0 bottom-0 z-40 lg:z-20 w-full lg:w-96 bg-obsidian p-4 sm:p-6 border-l border-white/10 overflow-y-auto studio-scrollbar-dark transition-transform duration-300 flex flex-col
          ${isMobileSpecsOpen 
            ? 'h-[85vh] rounded-t-3xl border-t border-white/20 shadow-2xl translate-y-0' 
            : 'translate-y-full lg:translate-y-0 lg:h-full'
          }
        `}>
          {/* Mobile Specs Sheet Header */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
            <h2 className="text-sm font-bold uppercase tracking-widest text-linen">Build Specs & Summary</h2>
            <button 
              onClick={() => setIsMobileSpecsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 text-sand hover:text-white flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          <h2 className="hidden lg:block text-lg font-bold uppercase tracking-widest text-linen mb-6 pb-2 border-b border-white/10">
            Build Specs
          </h2>

          <PowerWaterGauge />
          <SubmitDesignButton />

          <div className="mt-8 text-[11px] text-white/40 text-center uppercase tracking-wider space-y-1.5 pb-20 lg:pb-0">
            <p>* Drag or tap modules to add to grid.</p>
            <p>* Specs are live estimates for builder consultation.</p>
          </div>
        </div>

      </div>

      {/* Mobile Floating Action Controls (Screens < 1024px) */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 bg-[#181A1D]/90 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl">
        <button
          onClick={() => {
            setIsMobileCatalogOpen(true);
            setIsMobileSpecsOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-terracotta text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
        >
          <PackagePlus size={16} />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => {
            setIsMobileSpecsOpen(true);
            setIsMobileCatalogOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-white/10 active:scale-95 transition-transform"
        >
          <Sliders size={16} />
          <span>Specs</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
      
      {/* Initial Vehicle Selector Setup Modal */}
      <VehicleSetupModal />
    </div>
  );
}
