'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Plus, Trash2, Edit3, CarFront, Cuboid, Loader2, ChevronDown, Check } from 'lucide-react';
import useChassisStore from '@/store/useChassisStore';
import ShowroomCanvas from '../../../../components/3d/ShowroomCanvas';

export default function AdminTemplatesClient() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { chassis: dbChassis, fetchChassis } = useChassisStore();
  const [loading, setLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedChassisId, setSelectedChassisId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('list'); // 'list', 'preview'

  useEffect(() => {
    fetchData();
    fetchChassis();
  }, [fetchChassis]);

  const fetchData = async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      setLoading(true);
      const resTemplates = await axios.get(`${API_BASE}/api/templates`);
      setTemplates(resTemplates.data);
      if (resTemplates.data.length > 0) {
        setSelectedTemplate(resTemplates.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChassisName = (chassisId) => {
    const v = dbChassis.find(c => c.id === chassisId);
    return v ? v.name : chassisId;
  };

  const groupedClasses = dbChassis.reduce((acc, c) => {
    const classId = c.class || c.chassisType || 'other';
    if (!acc[classId]) {
      // Auto-format the class name (e.g. 'compact-classic' -> 'Compact Classic')
      const formattedName = classId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      acc[classId] = {
        id: classId,
        name: formattedName + ' Class',
        models: []
      };
    }
    acc[classId].models.push({ id: c.id, name: c.name });
    return acc;
  }, {});

  const dynamicVehicleClasses = Object.values(groupedClasses);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      await axios.delete(`${API_BASE}/api/templates/${id}`);
      const remaining = templates.filter(t => t._id !== id);
      setTemplates(remaining);
      if (selectedTemplate?._id === id) {
        setSelectedTemplate(remaining.length > 0 ? remaining[0] : null);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleCreateNew = () => {
    if (!selectedChassisId) return;
    window.location.href = `/admin/templates/builder/new?chassisId=${selectedChassisId}`;
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] text-white overflow-hidden -m-6 rounded-3xl bg-[#090A0F] border border-white/5">
      
      {/* Mobile Tab Switcher Bar (< 768px) */}
      <div className="md:hidden flex bg-[#111216]/80 backdrop-blur border-b border-white/10 p-1.5 shrink-0 gap-1 z-30">
        <button
          type="button"
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            mobileTab === 'list' ? 'bg-sky-500 text-sky-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Templates List
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            mobileTab === 'preview' ? 'bg-sky-500 text-sky-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          3D Preview
        </button>
      </div>

      {/* Left Sidebar (Master List) */}
      <div className={`w-full md:w-96 flex flex-col bg-slate-900/50 border-r border-white/10 shrink-0 z-20 ${
        mobileTab === 'list' ? 'flex' : 'hidden md:flex'
      }`}>
        <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">Layout Templates</h1>
          <button 
            onClick={() => setIsNewModalOpen(true)}
            className="w-full flex justify-center items-center px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-[0_0_20px_rgba(14,165,233,0.2)] gap-2 font-bold transition-all"
          >
            <Plus size={18} />
            Create Template
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-sky-400" size={32} />
          </div>
        ) : templates.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <Cuboid size={48} className="mb-4 opacity-50" />
            <p>No templates created yet.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {templates.map(template => {
              const isSelected = selectedTemplate?._id === template._id;
              return (
                <div
                  key={template._id}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setMobileTab('preview');
                  }}
                  className={`
                    p-4 rounded-xl cursor-pointer transition-all border flex flex-col gap-1
                    ${isSelected 
                      ? 'bg-sky-500/10 border-sky-500/30 shadow-[inset_4px_0_0_rgba(14,165,233,1)]' 
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                    }
                  `}
                >
                  <h3 className={`font-bold line-clamp-1 ${isSelected ? 'text-sky-400' : 'text-white'}`}>
                    {template.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <CarFront size={12} />
                      {getChassisName(template.chassisId)}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      {template.modules?.length || 0} Mods
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Panel (Detail View) */}
      <div className={`flex-1 flex flex-col relative bg-gradient-to-br from-[#181A1D] to-black ${
        mobileTab === 'preview' ? 'flex' : 'hidden md:flex'
      }`}>
        {selectedTemplate ? (
          <>
            {/* 3D Canvas Area */}
            <div className="flex-1 relative">
              <ShowroomCanvas 
                customModules={selectedTemplate.modules} 
                activeModelId={selectedTemplate.chassisId} 
                cameraPreset="iso"
              />
              
              {/* Floating detail tag on top left of the 3D space */}
              <div className="absolute top-6 left-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <CarFront size={16} className="text-sky-400" />
                <span className="text-sm font-bold text-white">{getChassisName(selectedTemplate.chassisId)}</span>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="h-24 bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 flex items-center justify-between shrink-0 relative z-10 gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-extrabold text-white mb-1 truncate">{selectedTemplate.name}</h2>
                <p className="text-xs text-slate-400 truncate">{selectedTemplate.description || "No description provided."}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 font-bold text-xs whitespace-nowrap shadow-inner hidden md:flex">
                  <Cuboid size={14} className="text-sky-400" />
                  {selectedTemplate.modules?.length || 0} Mods
                </div>
                
                <button 
                  onClick={() => { window.location.href = `/admin/templates/builder/${selectedTemplate._id}`; }}
                  className="flex items-center justify-center h-10 px-5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg font-bold transition-all hover:scale-105 gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)] text-sm whitespace-nowrap"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(selectedTemplate._id)}
                  className="flex items-center justify-center h-10 w-10 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20 hover:border-transparent hover:scale-105 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
            <Cuboid size={80} className="mb-6" />
            <p className="text-xl font-medium">Select a template from the list to view its 3D layout.</p>
          </div>
        )}
      </div>

      {/* New Template Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white">Create New Template</h2>
            <p className="text-slate-400 text-sm mb-8">Select a chassis model to build the layout upon.</p>
            
            <div className="space-y-4 mb-10">
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Base Chassis</label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-black/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-sky-500/50 transition-colors shadow-inner"
                >
                  <span className={selectedChassisId ? "text-white font-medium" : "text-slate-500 font-medium"}>
                    {selectedChassisId ? getChassisName(selectedChassisId) : "Select a vehicle model..."}
                  </span>
                  <ChevronDown size={20} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full mt-3 left-0 w-full bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto custom-scrollbar">
                    {dynamicVehicleClasses.map(vClass => (
                      <div key={vClass.id} className="py-2">
                        <div className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-black/20">{vClass.name}</div>
                        {vClass.models.map(model => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedChassisId(model.id);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-5 py-3 text-sm text-slate-300 hover:text-white hover:bg-sky-500/20 transition-colors flex items-center justify-between font-medium"
                          >
                            {model.name}
                            {selectedChassisId === model.id && <Check size={16} className="text-sky-400" />}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-6 py-3 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 font-bold transition-colors"
                onClick={() => setIsNewModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-colors shadow-lg" 
                disabled={!selectedChassisId}
                onClick={handleCreateNew}
              >
                Launch Builder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
