'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Mail, Phone, Loader2 } from 'lucide-react';
import ShowroomCanvas from '../../../../../components/3d/ShowroomCanvas';
import useStudioStore from '../../../../../store/useStudioStore';
import { generateStudioPDF } from '../../../../../utils/pdfGenerator';

export default function AdminStudioViewerClient({ id }) {
  const { setActiveModule, activeModuleId } = useStudioStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraPreset, setCameraPreset] = useState('iso');
  const [updating, setUpdating] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      try {
        const res = await axios.get(`${API_BASE}/api/studio/designs/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch design:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleMarkAsReviewed = async () => {
    if (data?.status === 'Reviewed') return;
    
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      setUpdating(true);
      await axios.patch(`${API_BASE}/api/studio/designs/${id}/status`, {
        status: 'Reviewed'
      });
      setData(prev => ({ ...prev, status: 'Reviewed' }));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to mark as reviewed. Check console for details.");
    } finally {
      setUpdating(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await generateStudioPDF({
        id,
        data,
        modulesList,
        setCameraPreset
      });
    } catch (error) {
      console.error("PDF Gen Error:", error);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-terracotta" size={32} />
      </div>
    );
  }

  if (!data) {
    return <div className="text-white flex justify-center items-center h-full">Design not found or failed to load.</div>;
  }

  const getLegacyModelId = (baseVehicle) => {
    if (baseVehicle === 'maxi-bus') return 'uk-double-decker';
    if (baseVehicle === 'minibus-canvas') return 'sprinter-170';
    if (baseVehicle === 'standard-highroof') return 'sprinter-144';
    if (baseVehicle === 'compact-classic') return 't3-van';
    return null;
  };

  const modulesList = data.configurationData?.placedModules || data.configurationData?.components || [];

  return (
    <div className="space-y-6 min-h-[100dvh] lg:h-full flex flex-col pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/studio"
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Client Design Layout</h1>
            <p className="text-xs sm:text-sm text-slate-400">Request #{id || '1234'}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors border ${
              generatingPDF 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-wait' 
                : 'bg-transparent hover:bg-white/5 text-slate-300 border-slate-700'
            }`}
          >
            {generatingPDF ? <Loader2 size={16} className="animate-spin" /> : null}
            {generatingPDF ? 'Generating...' : 'Export to PDF'}
          </button>

          <button 
            onClick={handleMarkAsReviewed}
            disabled={data.status === 'Reviewed' || updating || generatingPDF}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              data.status === 'Reviewed' 
                ? 'bg-green-500/20 text-green-400 cursor-not-allowed border border-green-500/30' 
                : 'bg-terracotta hover:bg-terracotta/95 text-white'
            }`}
          >
            {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {data.status === 'Reviewed' ? 'Reviewed' : updating ? 'Updating...' : 'Mark as Reviewed'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 h-[55vh] lg:h-full bg-[#111216] border border-white/10 rounded-2xl overflow-hidden relative shadow-inner p-6 flex flex-col shrink-0 lg:shrink">
          <ShowroomCanvas 
            customModules={modulesList} 
            activeModelId={data.configurationData?.activeModelId || getLegacyModelId(data.baseVehicle)}
            activeChassis={data.configurationData?.activeChassis || data.baseVehicle}
            cameraPreset={cameraPreset} 
          />
          
          {/* Studio Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex gap-4 z-10 transition-opacity" style={{ opacity: generatingPDF ? 0 : 1 }}>
            <button 
              onClick={() => setCameraPreset('top')} 
              className={`text-sm font-medium transition-colors ${cameraPreset === 'top' ? 'text-terracotta' : 'text-white hover:text-terracotta-400'}`}
            >Top View</button>
            <button 
              onClick={() => setCameraPreset('inside')} 
              className={`text-sm font-medium transition-colors ${cameraPreset === 'inside' ? 'text-terracotta' : 'text-white hover:text-terracotta-400'}`}
            >Inside View</button>
            <button 
              onClick={() => setCameraPreset('iso')} 
              className={`text-sm font-medium transition-colors ${cameraPreset === 'iso' ? 'text-terracotta' : 'text-white hover:text-terracotta-400'}`}
            >3D Orbit</button>
          </div>
        </div>

        <div id="client-info-panel" className="bg-[#111216] border border-white/10 rounded-2xl p-6 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Client Details</h2>
            <div className="space-y-3">
              <div className="bg-[#0B0C10]/50 rounded-lg p-3 border border-white/5">
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <p className="text-sm text-white font-medium">{data.clientInfo.name}</p>
              </div>
              <div className="bg-[#0B0C10]/50 rounded-lg p-3 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-sm text-white font-medium">{data.clientInfo.email}</p>
                </div>
                <button className="p-2 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20"><Mail size={16} /></button>
              </div>
              <div className="bg-[#0B0C10]/50 rounded-lg p-3 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="text-sm text-white font-medium">{data.clientInfo.phone}</p>
                </div>
                <button className="p-2 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20"><Phone size={16} /></button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Base Vehicle</h2>
            <div className="bg-[#0B0C10]/50 rounded-lg p-3 border border-white/5">
              <p className="text-sm text-white font-medium">{data.baseVehicle}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Bill of Materials</h2>
            <p className="text-xs text-slate-500 mb-2">Click to highlight in 3D viewer</p>
            <ul className="space-y-2 text-sm">
              {modulesList.map((comp, i) => {
                const isActive = activeModuleId === comp.id;
                return (
                  <li 
                    key={i} 
                    onClick={() => setActiveModule(isActive ? null : comp.id)}
                    className={`flex justify-between items-center p-2 rounded-md cursor-pointer transition-colors border ${
                      isActive 
                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                        : 'border-transparent text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col overflow-hidden mr-4">
                      <span className="truncate text-white font-medium">{comp.name || comp.type || comp.typeId}</span>
                      {comp.dimensions && (
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {comp.dimensions[0]}m x {comp.dimensions[2]}m x {comp.dimensions[1]}m
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-slate-400 whitespace-nowrap bg-black/20 px-2 py-1 rounded-md text-xs border border-white/5">1x</span>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {data.message && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Client Message</h2>
              <div className="bg-[#0B0C10]/50 rounded-lg p-3 border border-white/5">
                <p className="text-sm text-slate-300 italic">"{data.message}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
