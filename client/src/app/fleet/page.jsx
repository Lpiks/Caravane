"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import { fetchVehicles } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import VanCard from "@/components/fleet/VanCard";

const TABS = [
  { id: '', label: 'All Units' },
  { id: 'sale', label: 'For Sale' },
  { id: 'rental', label: 'Expedition Rentals' }
];

export default function FleetPage() {
  const [activeTab, setActiveTab] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    sleeps: 0,
    chassis: ''
  });

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      const data = await fetchVehicles({ type: activeTab, ...filters });
      setVehicles(data);
      setLoading(false);
    };
    loadVehicles();
  }, [activeTab, filters]);

  // Framer Motion Variants for staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="bg-obsidian min-h-screen text-linen font-sans overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-6 pt-32 pb-24 relative">
        {/* Hero Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[0.1em] text-sand mb-4 drop-shadow-lg">
              The Fleet
            </h1>
            <p className="text-sm md:text-base font-medium text-linen/70 max-w-2xl font-mono tracking-wide leading-relaxed">
              Browse our current inventory of custom builds available for sale or expedition rental. 
              Each unit is hand-built in our Zone Industrielle Chéraga facility.
            </p>
          </div>
        </motion.header>

        {/* Animated Segmented Control Tabs & Filter Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/10 relative overflow-x-auto no-scrollbar shadow-xl w-full sm:w-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-2.5 rounded-full font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs transition-colors duration-300 flex-1 sm:flex-none ${
                  activeTab === tab.id ? 'text-white' : 'text-linen/50 hover:text-linen/80'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-fleet"
                    className="absolute inset-0 bg-terracotta rounded-full shadow-[0_0_15px_rgba(200,90,50,0.5)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-widest text-linen transition-colors w-full sm:w-auto justify-center"
          >
            <SlidersHorizontal size={14} className="text-terracotta" />
            Filters & Sort
          </button>
        </div>

        {/* Vehicle Grid */}
        <div className="min-h-[50vh]">
          {loading ? (
            <div className="w-full py-32 flex justify-center items-center flex-col gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-terracotta animate-spin"></div>
               <span className="text-sand/50 uppercase tracking-[0.2em] font-mono text-xs animate-pulse">Loading Database...</span>
            </div>
          ) : (
            vehicles.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="w-full py-32 flex justify-center items-center text-center text-linen/40 uppercase tracking-[0.2em] font-mono text-sm border border-white/5 rounded-3xl bg-white/5 backdrop-blur-sm"
              >
                No vehicles currently match this category or filter.
              </motion.div>
            ) : (
              <motion.div 
                key={`${activeTab}-${filters.sleeps}-${filters.chassis}`} 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {vehicles.map((v) => (
                  <VanCard key={v._id} vehicle={v} />
                ))}
              </motion.div>
            )
          )}
        </div>
      </main>

      {/* Pro Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#121417]/90 backdrop-blur-2xl border-l border-white/10 z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h2 className="text-lg font-black uppercase tracking-[0.1em] text-linen">Filter Inventory</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pb-10">
                
                {/* Sleeps Filter */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-linen/50 uppercase tracking-widest">Minimum Berths (Sleeps)</label>
                  <div className="flex gap-3">
                    {[0, 2, 3, 4].map(num => (
                      <button 
                        key={num}
                        onClick={() => setFilters(prev => ({ ...prev, sleeps: num }))}
                        className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                          filters.sleeps === num 
                          ? 'bg-terracotta border-terracotta text-white shadow-[0_0_15px_rgba(200,90,50,0.4)]' 
                          : 'bg-white/5 border-white/10 text-linen hover:bg-white/10'
                        }`}
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chassis Search */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-linen/50 uppercase tracking-widest">Chassis Base</label>
                  <input 
                    type="text" 
                    value={filters.chassis}
                    onChange={(e) => setFilters(prev => ({ ...prev, chassis: e.target.value }))}
                    placeholder="e.g. Sprinter, Crafter"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-linen focus:outline-none focus:border-terracotta/50 focus:bg-white/5 transition-all"
                  />
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setFilters({ sleeps: 0, chassis: '' });
                    setIsFilterOpen(false);
                  }}
                  className="py-3 rounded-xl border border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="py-3 rounded-xl bg-terracotta font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(200,90,50,0.3)] hover:bg-[#b45309] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
