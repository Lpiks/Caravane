'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, Plus, Box, Ruler, Lock, Truck, X, Settings2, ChevronRight, Layers, Cylinder, Triangle, Circle, Trash2, ChevronDown, Check } from 'lucide-react';
import ComponentPreviewCanvas from '../../../../components/3d/ComponentPreviewCanvas';
import useComponentStore from '@/store/useComponentStore';
import axios from 'axios';

export default function AdminComponentsClient() {
  const [activeChassis, setActiveChassis] = useState('standard-highroof');
  const [editingComponent, setEditingComponent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [editForm, setEditForm] = useState({ l: 0, w: 0, h: 0, category: '' });
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const { components, fetchComponents, isLoading, updateComponentInCache, removeComponentFromCache } = useComponentStore();

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const chassisOptions = [
    { id: 'compact-classic', label: 'Compact Class' },
    { id: 'standard-highroof', label: 'Standard Class' },
    { id: 'minibus-canvas', label: 'Maxi Class' },
    { id: 'maxi-bus', label: 'Maxi Bus Class' }
  ];

  const CATEGORIES = [
    "Kitchen & Galley",
    "Bathroom & Plumbing",
    "Living & Sleeping",
    "Power & Electrical",
    "Climate & Ventilation"
  ];

  const handleEditClick = (e, comp) => {
    e.stopPropagation();
    setEditingComponent(comp);
    
    const override = comp.chassisOverrides?.[activeChassis] || {};
    
    setEditForm({
      l: override.l || comp.defaultL || 0,
      w: override.w || comp.defaultW || 0,
      h: override.h || comp.defaultH || 0,
      category: comp.category || "Living & Sleeping"
    });
  };

  const handleSaveChanges = async () => {
    if (!editingComponent) return;
    try {
      // Remove 'icon' (which is a React Component) and '_id' from the payload
      const { icon, _id, ...safeComponent } = editingComponent;
      
      const payload = {
        ...safeComponent,
        chassisOverrides: {
          ...(safeComponent.chassisOverrides || {}),
          [activeChassis]: {
            l: Number(editForm.l),
            w: Number(editForm.w),
            h: Number(editForm.h)
          }
        },
        category: editForm.category
      };
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.put(`${API_BASE}/api/components/${editingComponent.id}`, payload);
      updateComponentInCache(payload);
      setEditingComponent(null);
      if (selectedComponent?.id === payload.id) setSelectedComponent(payload);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    }
  };

  const handleDelete = async () => {
    if (!editingComponent) return;
    if (confirm("Are you sure you want to remove this component from this chassis?")) {
      try {
        const id = editingComponent.id;
        const compToDelete = components.find(c => c.id === id);
        
        // Ensure compatibleChassis exists and map legacy
        let compatible = compToDelete.compatibleChassis || [];
        if (compatible.length === 0) {
           if (!compToDelete.targetChassis || compToDelete.targetChassis === 'all') {
             compatible = ['compact-classic', 'standard-highroof', 'minibus-canvas', 'maxi-bus'];
           } else {
             const legacyMap = { 't3': 'compact-classic', 'l3h2': 'standard-highroof', 'minibus': 'minibus-canvas' };
             compatible = [legacyMap[compToDelete.targetChassis] || compToDelete.targetChassis];
           }
        }
        
        // Remove current activeChassis
        const newCompatible = compatible.filter(c => c !== activeChassis);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        if (newCompatible.length === 0) {
           // Complete Delete (Garbage Collection)
           await axios.delete(`${API_BASE}/api/components/${id}`);
           removeComponentFromCache(id);
        } else {
           // Soft Delete (Update array)
           const { icon, _id, ...safeComponent } = compToDelete;
           const payload = { ...safeComponent, compatibleChassis: newCompatible };
           await axios.put(`${API_BASE}/api/components/${id}`, payload);
           updateComponentInCache(payload);
        }

        setEditingComponent(null);
        if (selectedComponent?.id === id) {
          setSelectedComponent(null);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete component.");
      }
    }
  };

  const componentsList = components
    .filter(c => {
       let compatible = c.compatibleChassis || [];
       if (compatible.length === 0) {
         if (!c.targetChassis || c.targetChassis === 'all') return true;
         const legacyMap = { 't3': 'compact-classic', 'l3h2': 'standard-highroof', 'minibus': 'minibus-canvas' };
         return (legacyMap[c.targetChassis] || c.targetChassis) === activeChassis;
       }
       // If compatible with minibus-canvas, it is also compatible with maxi-bus class!
       const effectiveCompatible = [...compatible];
       if (effectiveCompatible.includes('minibus-canvas') && !effectiveCompatible.includes('maxi-bus')) {
         effectiveCompatible.push('maxi-bus');
       }
       return effectiveCompatible.includes(activeChassis);
    })
    .map(c => ({ ...c, icon: c.icon === 'Ruler' ? Ruler : Box }));

  const activeComponent = selectedComponent || componentsList[0];

  const getActiveL = (comp) => {
    if (comp?.chassisOverrides?.[activeChassis]?.l) return comp.chassisOverrides[activeChassis].l;
    return comp?.id === 'bed-fixed' ? (activeChassis === 'compact-classic' ? 140 : activeChassis === 'minibus-canvas' ? 200 : 185) : (comp?.defaultL || 100);
  };
  const getActiveW = (comp) => {
    if (comp?.chassisOverrides?.[activeChassis]?.w) return comp.chassisOverrides[activeChassis].w;
    return comp?.defaultW || 100;
  };
  const getActiveH = (comp) => {
    if (comp?.chassisOverrides?.[activeChassis]?.h) return comp.chassisOverrides[activeChassis].h;
    return comp?.id === 'overhead-locker' ? (activeChassis === 'compact-classic' ? 25 : 40) : (comp?.defaultH || 100);
  };

  const displayParts = activeComponent?.parts && activeComponent.parts.length > 0 ? activeComponent.parts.map(part => {
    const defaultL = activeComponent.defaultL || 1;
    const defaultW = activeComponent.defaultW || 1;
    const defaultH = activeComponent.defaultH || 1;
    const scaleL = getActiveL(activeComponent) / defaultL;
    const scaleW = getActiveW(activeComponent) / defaultW;
    const scaleH = getActiveH(activeComponent) / defaultH;

    // Deep clone size and offset arrays so we don't mutate original state
    return {
      ...part,
      size: [
        (part.size?.[0] || 0) * scaleL,
        (part.size?.[1] || 0) * scaleW,
        (part.size?.[2] || 0) * scaleH
      ],
      offset: [
        (part.offset?.[0] || 0) * scaleL,
        (part.offset?.[1] || 0) * scaleH,
        (part.offset?.[2] || 0) * scaleW
      ]
    };
  }) : [{
    id: 'base',
    name: 'Base Mesh',
    shape: 'box',
    size: [getActiveL(activeComponent), getActiveW(activeComponent), getActiveH(activeComponent)],
    offset: [0, 0, 0],
    rotation: [0, 0, 0],
    color: activeComponent?.type === 'parametric' ? '#4f46e5' : '#10b981'
  }];

  return (
    <div className="space-y-6">
      {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Master 3D Settings</h1>
          <p className="text-slate-400">Manage exact physical dimensions and parametric constraints for 3D Studio modules.</p>
        </div>
        <Link href="/admin/components/builder" className="bg-sky-500 hover:bg-sky-400 text-sky-950 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Plus size={18} />
          New Component
        </Link>
      </div>

      {/* Chassis Context Selector */}
      <div className="bg-[#181A1D] border border-white/10 rounded-xl p-2 inline-flex gap-1 overflow-x-auto max-w-full">
        {chassisOptions.map(chassis => (
          <button
            key={chassis.id}
            onClick={() => setActiveChassis(chassis.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeChassis === chassis.id 
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Truck size={16} />
            {chassis.label}
          </button>
        ))}
      </div>

      {/* Split View Layout */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[100dvh] lg:h-[calc(100vh-16rem)] pb-12 lg:pb-0">
        
        {/* Left Side: Components List */}
        <div className="h-[160px] lg:h-auto lg:flex-1 bg-[#111216] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-inner shrink-0 lg:shrink">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:grid shrink-0">
            <div className="col-span-5">Component Name</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-4">Base Dimensions</div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
            {componentsList.map((comp) => {
              const isSelected = activeComponent?.id === comp.id;
              return (
                <div 
                  key={comp.id} 
                  onClick={() => setSelectedComponent(comp)}
                  className={`flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:items-center cursor-pointer transition-colors group ${
                    isSelected ? 'bg-sky-500/10 border-l-4 border-sky-500' : 'hover:bg-white/[0.02] border-l-4 border-transparent'
                  }`}
                >
                  <div className="md:col-span-5 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${comp.type === 'parametric' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      <comp.icon size={16} />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                      {comp.name}
                    </span>
                  </div>
                  
                  <div className="md:col-span-3 flex items-center">
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-semibold tracking-wide uppercase ${
                      comp.type === 'parametric' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {comp.type}
                    </span>
                  </div>
                  
                  <div className="md:col-span-4 flex items-center justify-between">
                    <span className={`text-sm font-mono ${isSelected ? 'text-sky-300' : 'text-slate-400'}`}>
                      {getActiveL(comp)} x {getActiveW(comp)} x {getActiveH(comp)} cm
                    </span>
                    <button 
                      onClick={(e) => handleEditClick(e, comp)}
                      className="p-1.5 text-slate-500 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors"
                      title="Edit Dimensions & Category"
                    >
                      <Settings2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Sticky Preview Panel */}
        {activeComponent && (
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
                  <h2 className="text-xl font-bold text-white mb-2">{activeComponent.name}</h2>
                  <div className="flex gap-2">
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-semibold tracking-wide uppercase ${
                      activeComponent.type === 'parametric' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {activeComponent.type}
                    </span>
                    {activeComponent.targetChassis && activeComponent.targetChassis !== 'all' && (
                      <span className="inline-flex px-2 py-1 rounded text-[10px] font-semibold tracking-wide uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        Chassis Specific
                      </span>
                    )}
                  </div>
                </div>
                {(activeComponent.id.startsWith('custom-') || (activeComponent.parts && activeComponent.parts.length > 0)) && (
                  <Link 
                    href={`/admin/components/builder?edit=${activeComponent.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-400 hover:text-white bg-sky-500/10 hover:bg-sky-500 transition-colors border border-sky-500/20 hover:border-transparent shrink-0"
                  >
                    <Settings2 size={14} />
                    Edit in Builder
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Dimensions (LxWxH)</div>
                  <div className="text-sm font-mono text-white">
                    {getActiveL(activeComponent)} x {getActiveW(activeComponent)} x {getActiveH(activeComponent)}
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

              {/* Parts Breakdown */}
              <div className="space-y-3 mt-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Parts Breakdown</h3>
                <div className="grid grid-cols-2 gap-2">
                  {displayParts.map((part, idx) => {
                    const ShapeIcon = part.shape === 'cylinder' ? Cylinder : part.shape === 'wedge' ? Triangle : part.shape === 'sphere' ? Circle : Box;
                    return (
                      <div key={part.id || idx} className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#0B0C10] flex items-center justify-center shrink-0 shadow-inner" style={{ color: part.color || '#fff' }}>
                            <ShapeIcon size={12} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-white truncate">{part.name}</div>
                            <div className="text-[9px] text-slate-400 uppercase tracking-wider leading-none">{part.shape}</div>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 bg-black/20 rounded px-1.5 py-1 text-center">
                          {part.size?.[0] || 0}x{part.size?.[1] || 0}x{part.size?.[2] || 0}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeComponent.type === 'parametric' && (
                <div className="mt-auto p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl flex items-start gap-3">
                  <Lock className="text-sky-400 mt-0.5 shrink-0" size={16} />
                  <p className="text-xs text-sky-400/80 leading-relaxed">
                    This component automatically scales its dimensions based on the active chassis context.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal Popup */}
      {editingComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#181A1D] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${editingComponent.type === 'parametric' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <editingComponent.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{editingComponent.name}</h3>
                  <p className="text-xs text-slate-400">Edit exact physical dimensions</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingComponent(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {editingComponent.type === 'parametric' && (
                <div className="mb-6 p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-start gap-3">
                  <Lock className="text-sky-400 mt-0.5 shrink-0" size={16} />
                  <div>
                    <h4 className="text-sm font-medium text-sky-400 mb-1">Parametric Constraints Active</h4>
                    <p className="text-xs text-sky-400/80 leading-relaxed">
                      Certain dimensions for this component are dynamically constrained by the selected vehicle chassis ({chassisOptions.find(c => c.id === activeChassis)?.label}).
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-6 space-y-2">
                <label className="text-xs font-medium text-slate-400">Category</label>
                <div className="relative">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center justify-between bg-[#0B0C10] border border-white/10 hover:border-white/20 rounded-lg px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all w-full"
                  >
                    <span className="font-semibold">{editForm.category}</span>
                    <ChevronDown size={16} className={`text-slate-500 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#181A1D] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-1 flex flex-col">
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              setEditForm({...editForm, category: cat});
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors flex items-center justify-between ${
                              editForm.category === cat ? 'bg-sky-500/10 text-sky-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {cat}
                            {editForm.category === cat && <Check size={16} className="text-sky-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400">Length Override ({chassisOptions.find(c => c.id === activeChassis)?.label})</label>
                  </div>
                  <div className={`relative flex items-center`}>
                    <input 
                      type="number" 
                      value={editForm.l} 
                      onChange={(e) => setEditForm({...editForm, l: e.target.value})}
                      className="bg-[#0B0C10] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all w-full font-mono" 
                    />
                    <span className="absolute right-4 text-xs text-slate-500 font-mono select-none pointer-events-none">cm</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Width / Depth</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" 
                      value={editForm.w} 
                      onChange={(e) => setEditForm({...editForm, w: e.target.value})}
                      className="bg-[#0B0C10] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all w-full font-mono" 
                    />
                    <span className="absolute right-4 text-xs text-slate-500 font-mono select-none pointer-events-none">cm</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400">Height Override ({chassisOptions.find(c => c.id === activeChassis)?.label})</label>
                  </div>
                  <div className={`relative flex items-center`}>
                    <input 
                      type="number" 
                      value={editForm.h} 
                      onChange={(e) => setEditForm({...editForm, h: e.target.value})}
                      className="bg-[#0B0C10] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all w-full font-mono" 
                    />
                    <span className="absolute right-4 text-xs text-slate-500 font-mono select-none pointer-events-none">cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/5 bg-white/[0.02] flex justify-between items-center">
              <button 
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>

              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingComponent(null)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-sky-950 bg-sky-400 hover:bg-sky-300 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
