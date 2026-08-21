'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import useStudioStore from '@/store/useStudioStore';
import ModuleSidebar3D from '@/components/studio/ModuleSidebar3D';
import StudioCanvas3D from '@/components/studio/StudioCanvas3D';
import { Settings, Save, ChevronLeft, Loader2 } from 'lucide-react';
import useChassisStore from '@/store/useChassisStore';
import useComponentStore from '@/store/useComponentStore';

export default function AdminTemplateBuilderClient({ isNew, templateId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chassisIdParam = searchParams.get('chassisId');
  
  const { 
    activeChassis, 
    activeModelId, 
    setHasChosenVehicle, 
    clearStudio, 
    placedModules,
    setVehicle
  } = useStudioStore();

  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);
  const { chassis: dbChassis, fetchChassis } = useChassisStore();
  const { components, fetchComponents } = useComponentStore();

  useEffect(() => {
    fetchChassis();
    fetchComponents();
  }, [fetchChassis, fetchComponents]);

  useEffect(() => {
    // Wait until database chassis list AND components list are loaded
    if (dbChassis.length === 0 || components.length === 0) return;

    if (isNew && chassisIdParam) {
      clearStudio();
      setTimeout(() => {
        const vInfo = dbChassis.find(c => c.id === chassisIdParam);
        if (vInfo) {
          setVehicle(vInfo.class, chassisIdParam);
        }
      }, 50);
      setIsLoading(false);
    } else if (!isNew && templateId) {
      fetchTemplateData(templateId);
    }
  }, [isNew, templateId, chassisIdParam, dbChassis, components]);

  const fetchTemplateData = async (id) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await axios.get(`${API_BASE}/api/templates/${id}`);
      const data = res.data;
      
      setTemplateName(data.name);
      setTemplateDescription(data.description || '');
      
      clearStudio();
      setTimeout(() => {
        // Here we use the component state dbChassis which is now guaranteed to be populated
        const vInfo = dbChassis.find(c => c.id === data.chassisId);
        if (vInfo) {
          setVehicle(vInfo.class, data.chassisId);
          setTimeout(() => {
            useStudioStore.getState().loadTemplate(data.modules);
          }, 50);
        }
      }, 50);
    } catch (error) {
      console.error(error);
      alert('Error loading template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!templateName) return alert('Please enter a template name');
    
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    setIsSaving(true);
    try {
      const payload = {
        name: templateName,
        description: templateDescription,
        chassisId: activeModelId,
        modules: placedModules
      };

      const url = isNew ? `${API_BASE}/api/templates` : `${API_BASE}/api/templates/${templateId}`;

      let res;
      if (isNew) {
        res = await axios.post(url, payload);
      } else {
        res = await axios.put(url, payload);
      }
      
      alert('Template saved successfully!');
      window.location.href = '/admin/templates';
    } catch (error) {
      console.error(error);
      alert('Error saving template');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-white bg-slate-950"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden text-white">
      
      {/* Header */}
      <div className="w-full bg-slate-900 border-b border-white/10 py-3 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { window.location.href = '/admin/templates'; }}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ChevronLeft size={16} />
            Back to Templates
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-2 text-sky-400">
            <Settings size={18} />
            <h1 className="text-lg font-bold tracking-tight">Admin Template Builder</h1>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
            {activeModelId ? dbChassis.find(c => c.id === activeModelId)?.name || 'Unknown' : 'Unknown'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white gap-2 font-bold shadow-lg shadow-sky-500/20 transition-colors"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isNew ? 'Save New Template' : 'Update Template'}
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Components) */}
        <ModuleSidebar3D />

        {/* Center Canvas */}
        <div className="flex-1 h-full relative bg-slate-950/50">
          <StudioCanvas3D />
        </div>

        {/* Right Sidebar (Template Settings) */}
        <div className="w-80 h-full bg-slate-900 border-l border-white/10 shrink-0 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold mb-1">Template Details</h2>
            <p className="text-xs text-slate-400">Configure the metadata for this layout.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Template Name *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Adventure Pro 4x4"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Briefly describe this layout and its intended use..."
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-colors resize-none"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Total Modules</span>
                <span className="font-bold text-white">{placedModules.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Weight</span>
                <span className="font-bold text-white">
                  {placedModules.reduce((acc, m) => acc + (m.weightKg || 0), 0)} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
