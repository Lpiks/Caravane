'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Box, Layers, Settings2, Truck, Trash2, Loader2 } from 'lucide-react';
import ComponentPreviewCanvas from '../../../../components/3d/ComponentPreviewCanvas';
import useChassisStore from '@/store/useChassisStore';
import axios from 'axios';

export default function AdminChassisClient() {
  const { chassis: allChassis, fetchChassis, isLoading, removeChassisFromCache } = useChassisStore();
  const [selectedChassis, setSelectedChassis] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchChassis();
  }, [fetchChassis]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this chassis blueprint from the database?")) {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      try {
        await axios.delete(`${API_BASE}/api/chassis/${id}`);
        removeChassisFromCache(id);
        setSelectedChassis(null);
      } catch (err) {
        console.error(err);
        alert("Failed to delete chassis blueprint.");
      }
    }
  };

  const chassisList = allChassis.filter(comp => {
    if (activeFilter === 'all') return true;
    return comp.chassisType === activeFilter;
  });

  const activeChassis = selectedChassis || chassisList[0] || allChassis[0];

  const displayParts = activeChassis?.parts || [];

  const filterTabs = [
    { id: 'all', label: 'All Chassis', icon: Layers },
    { id: 't3', label: 'Compact Class', icon: Truck },
    { id: 'l3h2', label: 'Standard Class', icon: Truck },
    { id: 'minibus', label: 'Maxi Class', icon: Truck }
  ];

  const getClassName = (typeId) => {
    if (typeId === 't3') return 'COMPACT CLASS';
    if (typeId === 'l3h2') return 'STANDARD CLASS';
    if (typeId === 'minibus') return 'MAXI CLASS';
    return 'CUSTOM CHASSIS';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Chassis Inventory</h1>
          <p className="text-slate-400">Manage base van shells procedurally built from 3D primitives.</p>
        </div>
        <Link href="/admin/chassis/builder" className="bg-sky-500 hover:bg-sky-400 text-sky-950 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Plus size={18} />
          New Chassis
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {filterTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-sky-500 text-sky-950 shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Split View Layout */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[100dvh] lg:h-[calc(100vh-16rem)] pb-12 lg:pb-0">
        
        {/* Left Side: Chassis List */}
        <div className="h-[160px] lg:h-auto lg:flex-1 bg-[#111216] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-inner shrink-0 lg:shrink">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:grid shrink-0">
            <div className="col-span-5">Chassis Name</div>
            <div className="col-span-3">Class</div>
            <div className="col-span-4">Base Dimensions</div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                <Loader2 className="animate-spin mb-4 text-sky-500" size={32} />
                <p>Loading chassis from MongoDB...</p>
              </div>
            ) : chassisList.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Truck size={48} className="mx-auto mb-4 opacity-20" />
                <p>No chassis shells found in this class.</p>
                <p className="text-sm mt-2">Change filter or build a new one.</p>
              </div>
            ) : (
              chassisList.map((comp) => {
                const isSelected = activeChassis?.id === comp.id;
                return (
                  <div 
                    key={comp.id} 
                    onClick={() => setSelectedChassis(comp)}
                    className={`flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:items-center cursor-pointer transition-colors group ${
                      isSelected ? 'bg-sky-500/10 border-l-4 border-sky-500' : 'hover:bg-white/[0.02] border-l-4 border-transparent'
                    }`}
                  >
                    <div className="md:col-span-5 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Truck size={16} />
                      </div>
                      <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {comp.name}
                      </span>
                    </div>
                    
                    <div className="md:col-span-3 flex items-center">
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-semibold tracking-wide uppercase border ${
                        comp.type === 'static' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {getClassName(comp.chassisType)}
                      </span>
                    </div>
                    
                    <div className="md:col-span-4 flex items-center justify-between">
                      <span className={`text-sm font-mono ${isSelected ? 'text-sky-300' : 'text-slate-400'}`}>
                        {comp.defaultL} x {comp.defaultW} x {comp.defaultH} cm
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Sticky Preview Panel */}
        {activeChassis && (
          <div className="w-full lg:w-[400px] shrink-0 bg-[#181A1D] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur border border-white/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200 tracking-wide">3D PREVIEW</span>
            </div>
            
            {/* 3D Canvas Area */}
            <div className="h-[300px] bg-[#0B0C10] relative shrink-0">
              <ComponentPreviewCanvas parts={displayParts} activePartId={null} onSelectPart={() => {}} />
            </div>
            
            {/* Component Details */}
            <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{activeChassis.name}</h2>
                  <div className="flex gap-2">
                    <span className="inline-flex px-2 py-1 rounded text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CHASSIS
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <Link 
                    href={`/admin/chassis/builder?edit=${activeChassis.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-400 hover:text-white bg-sky-500/10 hover:bg-sky-500 transition-colors border border-sky-500/20 hover:border-transparent"
                  >
                    <Settings2 size={14} />
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(activeChassis.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 transition-colors border border-rose-500/20 hover:border-transparent"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Dimensions (LxWxH)</div>
                  <div className="text-sm font-mono text-white">
                    {activeChassis.defaultL} x {activeChassis.defaultW} x {activeChassis.defaultH}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Layer Count</div>
                  <div className="text-sm font-mono text-white flex items-center gap-2">
                    <Layers size={14} className="text-sky-400" />
                    {displayParts.length} Layer{displayParts.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
