import React from 'react';
import { Cuboid, Cpu, PenTool, Map, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesBentoGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">
      
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-sm font-bold text-sky-400 uppercase tracking-widest">The Platform</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">
          Engineered for <br className="md:hidden" /> True Independence
        </h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          We don't just build vans. We provide the software and engineering foundation 
          for you to design your perfect off-grid home, down to the last millimeter.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Card 1: 3D Studio (Large - spans 2 columns) */}
        <Link href="/studio" className="group relative col-span-1 md:col-span-2 bg-[#0d0e12] rounded-3xl p-8 border border-white/5 overflow-hidden transition-all duration-500 hover:border-sky-500/30 hover:shadow-[0_0_40px_rgba(56,189,248,0.1)] block">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-sky-500/20 transition-all duration-700" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-8">
              <Cuboid size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white mb-3">Real-Time 3D Configurator</h4>
              <p className="text-slate-400 max-w-md mb-6">
                Drag, drop, and snap professional-grade camper modules into your chosen chassis. Experience your build in immersive 3D before a single cut is made.
              </p>
              <div className="flex items-center text-sky-400 font-semibold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                Enter Studio <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 2: Live Engineering (Small) */}
        <div className="group relative col-span-1 bg-[#0d0e12] rounded-3xl p-8 border border-white/5 overflow-hidden transition-all duration-500 hover:border-terracotta/30">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-terracotta/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 group-hover:bg-terracotta/20 transition-all duration-700" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta mb-8">
              <Cpu size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-3">Live Pricing & Payload</h4>
              <p className="text-slate-400 text-sm">
                Every module placed instantly updates the vehicle's total weight, center of gravity, and exact cost. No surprises.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Blueprint Generation (Small) */}
        <div className="group relative col-span-1 bg-[#0d0e12] rounded-3xl p-8 border border-white/5 overflow-hidden transition-all duration-500 hover:border-emerald-500/30">
          <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/20 transition-all duration-700" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8">
              <PenTool size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-3">Export Blueprints</h4>
              <p className="text-slate-400 text-sm">
                Once satisfied, instantly generate a detailed PDF schematic of your layout, ready to be sent directly to our workshop.
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Expedition Proven (Large - spans 2 columns) */}
        <Link href="/expeditions" className="group relative col-span-1 md:col-span-2 bg-[#0d0e12] rounded-3xl p-8 border border-white/5 overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] block">
          {/* Subtle Background Pattern (Abstract Topo) */}
          <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700"
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-8">
              <Map size={28} />
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h4 className="text-2xl font-bold text-white mb-3">Expedition Proven</h4>
                <p className="text-slate-400 max-w-sm">
                  Our layouts aren't just theoretical. Explore the real-world routes our vehicles have conquered, from the Sahara to the Alps.
                </p>
              </div>
              <div className="flex items-center text-purple-400 font-semibold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform shrink-0">
                View Topo Map <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
