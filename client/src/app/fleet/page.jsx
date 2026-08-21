"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import { fetchVehicles } from "@/lib/api";
import { Moon, Sun, Droplets, ArrowRight } from "lucide-react";
import Link from "next/link";
import VanCard from "@/components/fleet/VanCard";

export default function FleetPage() {
  const [activeTab, setActiveTab] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      const data = await fetchVehicles(activeTab);
      setVehicles(data);
      setLoading(false);
    };
    loadVehicles();
  }, [activeTab]);

  return (
    <div className="bg-obsidian min-h-screen text-linen">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-6 pt-32 pb-16">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-sand mb-4">
            The Fleet
          </h1>
          <p className="text-sm md:text-base font-medium text-linen/70 max-w-2xl font-mono">
            Browse our current inventory of custom builds available for sale or expedition rental. 
            Each unit is hand-built in Algiers.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setActiveTab('')} 
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap transition-colors ${activeTab === '' ? 'bg-terracotta text-linen' : 'bg-white/10 hover:bg-white/20'}`}
          >
            All Units
          </button>
          <button 
            onClick={() => setActiveTab('sale')} 
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap transition-colors ${activeTab === 'sale' ? 'bg-terracotta text-linen' : 'bg-white/10 hover:bg-white/20'}`}
          >
            For Sale
          </button>
          <button 
            onClick={() => setActiveTab('rental')} 
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap transition-colors ${activeTab === 'rental' ? 'bg-terracotta text-linen' : 'bg-white/10 hover:bg-white/20'}`}
          >
            Expedition Rentals
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="w-full py-20 flex justify-center text-sand/50 uppercase tracking-widest font-mono text-sm animate-pulse">
            Loading Fleet Data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {vehicles.map((v) => (
              <VanCard key={v._id} vehicle={v} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
