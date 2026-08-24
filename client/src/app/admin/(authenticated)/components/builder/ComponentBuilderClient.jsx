'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Box as BoxIcon, Cylinder, Ruler, Palette, ShieldAlert, Layers, Plus, Trash2, Move, Minus, Copy, Check, ClipboardPaste, Triangle, Circle, RotateCw, ChevronDown } from 'lucide-react';
import ComponentPreviewCanvas from '../../../../../components/3d/ComponentPreviewCanvas';
import baseComponents from '../../../../../data/baseComponents.json';
import { useHistory } from '../../../../../hooks/useHistory';
import useComponentStore from '@/store/useComponentStore';
import axios from 'axios';

export default function ComponentBuilderClient() {
  const [componentName, setComponentName] = useState('Custom Component');
  const [states, setStates] = useState(['default']);
  const [activeState, setActiveState] = useState('default');
  const [newStateName, setNewStateName] = useState('');
  const [isAddingState, setIsAddingState] = useState(false);
  const { state: parts, set: setParts, undo, redo, reset: resetHistory } = useHistory([
    { id: 'part-1', name: 'Base Mesh', shape: 'box', size: [60, 60, 90], offset: [0, 0, 0], rotation: [0, 0, 0], color: '#4b5563' }
  ]);
  const [activePartId, setActivePartId] = useState('part-1');
  const [targetChassis, setTargetChassis] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedDim, setCopiedDim] = useState(false);
  const [copiedOffset, setCopiedOffset] = useState(false);
  const [copiedRot, setCopiedRot] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiImportAppend, setAiImportAppend] = useState(false);
  const [category, setCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [mobileTab, setMobileTab] = useState('preview'); // 'preview', 'specs', 'parts'

  // Use a unique ID generator for parts
  const nextPartId = useRef(2);

  // Initialize from edit URL if present
  useEffect(() => {
    const loadComponentData = async () => {
      const params = new URLSearchParams(window.location.search);
      const editId = params.get('edit');
      
      let comp = null;
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      if (editId) {
        try {
          const res = await axios.get(`${API_BASE}/api/components/${editId}`);
          comp = res.data;
        } catch (e) {
          console.log('Failed to fetch from DB, falling back to base components');
          comp = baseComponents.find(c => c.id === editId);
        }
      }

      if (comp) {
        setComponentName(comp.name);
        setTargetChassis(comp.targetChassis || 'all');
        if (comp.states) {
          setStates(comp.states);
        } else {
          setStates(['default']);
        }
        if (comp.parts && comp.parts.length > 0) {
          resetHistory(comp.parts);
          setActivePartId(comp.parts[0].id);

          // Update the ID generator so we don't collide when adding new parts
          const highestId = Math.max(...comp.parts.map(p => {
            const match = p.id.match(/part-(\d+)/);
            return match ? parseInt(match[1]) : 0;
          }));
          nextPartId.current = highestId + 1;
        }
      }
      
      const allCategories = new Set([
        "Kitchen & Galley", 
        "Bathroom & Plumbing", 
        "Living & Dining", 
        "Power & Utilities", 
        "Climate & Roof"
      ]);
      
      try {
        const res = await axios.get(`${API_BASE}/api/components`);
        res.data.forEach(c => c.category && allCategories.add(c.category));
      } catch (e) {
        console.error(e);
      }
      
      const categoriesArray = Array.from(allCategories);
      setAvailableCategories(categoriesArray);
      
      if (comp) {
        setCategory(comp.category || categoriesArray[0]);
      } else {
        setCategory(categoriesArray[0]);
      }
    };
    
    loadComponentData();
  }, [resetHistory]);

  const handleDuplicatePart = (partId, selectNew = true) => {
    const partToDup = parts.find(p => p.id === partId);
    if (partToDup) {
      const newId = `part-${nextPartId.current++}`;
      const dup = JSON.parse(JSON.stringify(partToDup));
      dup.id = newId;
      dup.name = `${dup.name} (Copy)`;
      setParts(prev => [...prev, dup]);
      if (selectNew) {
        setActivePartId(newId);
      }
    }
  };

  const handleImportAiCode = () => {
    try {
      // Try to extract JSON if they pasted the whole markdown block
      const jsonStart = aiInput.indexOf('[');
      const jsonEnd = aiInput.lastIndexOf(']');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        alert("Could not find a valid JSON array in the text.");
        return;
      }

      const jsonString = aiInput.substring(jsonStart, jsonEnd + 1);
      const parsedParts = JSON.parse(jsonString);

      if (!Array.isArray(parsedParts)) {
        alert("The imported code is not an array of objects.");
        return;
      }

      // Merge and ensure unique IDs
      const newParts = parsedParts.map(p => {
        const newId = `part-${nextPartId.current++}`;
        return { ...p, id: newId };
      });

      if (aiImportAppend) {
        setParts(prev => [...prev, ...newParts]);
      } else {
        setParts(newParts);
      }
      
      setIsAiModalOpen(false);
      setAiInput('');
      setActivePartId(newParts[0]?.id || activePartId);
    } catch (e) {
      console.error(e);
      alert("Error parsing AI JSON. Make sure the AI gave you valid JSON.");
    }
  };

  // Keyboard Shortcuts (Undo, Redo, Delete, Duplicate)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (parts.length > 1 && activePartId) {
          e.preventDefault();
          const newParts = parts.filter(p => p.id !== activePartId);
          setParts(newParts);
          setActivePartId(newParts[0].id);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (activePartId) {
          handleDuplicatePart(activePartId, true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, parts, activePartId, setParts]);

  const activePart = parts.find(p => p.id === activePartId) || parts[0];

  const updateActivePart = (updates) => {
    setParts(parts.map(p => p.id === activePartId ? { ...p, ...updates } : p));
  };

  const handleDimensionChange = (index, value) => {
    const newSize = [...activePart.size];
    newSize[index] = Number(value) || 0;
    updateActivePart({ size: newSize });
  };

  const getArrayValue = (part, field, state = activeState) => {
    if (!part[field]) return [0, 0, 0];
    if (Array.isArray(part[field])) return part[field];
    if (typeof part[field] === 'object') {
      return part[field][state] || part[field]['default'] || [0, 0, 0];
    }
    return [0, 0, 0];
  };

  const handleOffsetChange = (index, value) => {
    const currentArray = [...getArrayValue(activePart, 'offset')];
    currentArray[index] = Number(value) || 0;

    if (states.length === 1 && activeState === 'default' && Array.isArray(activePart.offset || [0, 0, 0])) {
      updateActivePart({ offset: currentArray });
    } else {
      const newOffsetObj = Array.isArray(activePart.offset)
        ? { default: activePart.offset }
        : { ...(activePart.offset || {}) };
      newOffsetObj[activeState] = currentArray;
      updateActivePart({ offset: newOffsetObj });
    }
  };

  const handleRotationChange = (index, value) => {
    const currentArray = [...getArrayValue(activePart, 'rotation')];
    currentArray[index] = Number(value) || 0;

    if (states.length === 1 && activeState === 'default' && Array.isArray(activePart.rotation || [0, 0, 0])) {
      updateActivePart({ rotation: currentArray });
    } else {
      const newRotObj = Array.isArray(activePart.rotation)
        ? { default: activePart.rotation }
        : { ...(activePart.rotation || {}) };
      newRotObj[activeState] = currentArray;
      updateActivePart({ rotation: newRotObj });
    }
  };

  const addPart = () => {
    const newId = `part-${nextPartId.current++}`;
    setParts([...parts, {
      id: newId,
      name: `Layer ${parts.length + 1}`,
      shape: 'box',
      size: [20, 20, 20],
      offset: [0, 0, 0],
      rotation: [0, 0, 0],
      color: '#4f46e5'
    }]);
    setActivePartId(newId);
  };

  const deletePart = (id) => {
    if (parts.length <= 1) return;
    const newParts = parts.filter(p => p.id !== id);
    setParts(newParts);
    if (activePartId === id) setActivePartId(newParts[newParts.length - 1].id);
  };

  const updatePartName = (id, newName) => {
    setParts(parts.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const handleSave = async (isCopy = false) => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');

    const basePart = parts[0] || {};
    const finalId = isCopy ? 'custom-' + Date.now() : (editId || 'custom-' + Date.now());
    const payload = {
      id: finalId,
      name: componentName || 'Custom Component',
      type: 'static',
      targetChassis,
      compatibleChassis: targetChassis === 'all' 
        ? ['compact-classic', 'standard-highroof', 'maxi-bus'] 
        : [targetChassis],
      defaultL: basePart.size?.[0] || 100,
      defaultW: basePart.size?.[1] || 100,
      defaultH: basePart.size?.[2] || 100,
      category,
      states,
      parts
    };

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      if (editId) {
        await axios.put(`${API_BASE}/api/components/${finalId}`, payload);
      } else {
        await axios.post(`${API_BASE}/api/components`, payload);
      }
      
      // Update global store if it was previously loaded
      useComponentStore.getState().updateComponentInCache(payload);
      
      alert(`Successfully saved "${payload.name}" to the Component Library for ${targetChassis}!`);
    } catch (e) {
      console.error(e);
      alert("Failed to save component to database.");
    }
  };

  const handleCanvasOffsetUpdate = (id, newOffset) => {
    setParts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (states.length === 1 && activeState === 'default' && Array.isArray(p.offset || [0, 0, 0])) {
        return { ...p, offset: newOffset };
      } else {
        const newOffsetObj = Array.isArray(p.offset) ? { default: p.offset } : { ...(p.offset || {}) };
        newOffsetObj[activeState] = newOffset;
        return { ...p, offset: newOffsetObj };
      }
    }));
  };

  const handleCanvasRotationUpdate = (id, newRotation) => {
    setParts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (states.length === 1 && activeState === 'default' && Array.isArray(p.rotation || [0, 0, 0])) {
        return { ...p, rotation: newRotation };
      } else {
        const newRotObj = Array.isArray(p.rotation) ? { default: p.rotation } : { ...(p.rotation || {}) };
        newRotObj[activeState] = newRotation;
        return { ...p, rotation: newRotObj };
      }
    }));
  };

  const handleCopy = (type, data) => {
    let arr = data || [0, 0, 0];
    if (type !== 'dim' && !Array.isArray(arr)) {
      arr = getArrayValue(activePart, type);
    }
    navigator.clipboard.writeText(`[${arr.join(', ')}]`);
    if (type === 'dim') {
      setCopiedDim(true);
      setTimeout(() => setCopiedDim(false), 2000);
    } else if (type === 'offset') {
      setCopiedOffset(true);
      setTimeout(() => setCopiedOffset(false), 2000);
    } else {
      setCopiedRot(true);
      setTimeout(() => setCopiedRot(false), 2000);
    }
  };

  const handlePaste = async (type) => {
    try {
      const text = await navigator.clipboard.readText();
      const match = text.match(/\[\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\]/);
      if (match) {
        const arr = [Number(match[1]), Number(match[2]), Number(match[3])];
        if (type === 'dim') {
          updateActivePart({ size: arr });
        } else if (type === 'offset') {
          handleOffsetChange(0, arr[0]);
          handleOffsetChange(1, arr[1]);
          handleOffsetChange(2, arr[2]);
        } else {
          handleRotationChange(0, arr[0]);
          handleRotationChange(1, arr[1]);
          handleRotationChange(2, arr[2]);
        }
      } else {
        alert("Clipboard does not contain a valid [X, Y, Z] format.");
      }
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  const renderSliderControl = ({ label, value, onChange, min, max, colorClass, bgClass }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-slate-400">{label}</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, Number(value) - 1))}
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 active:scale-95 touch-manipulation"
        >
          <Minus size={16} />
        </button>

        <div className="flex-1 min-w-[60px]">
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-2.5 sm:h-1.5 bg-[#0B0C10] ${bgClass} rounded-full appearance-none outline-none block cursor-pointer`}
          />
        </div>

        <button
          type="button"
          onClick={() => onChange(Math.min(max, Number(value) + 1))}
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 active:scale-95 touch-manipulation"
        >
          <Plus size={16} />
        </button>

        <div className="relative w-16 shrink-0">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-[#0B0C10] border border-white/10 rounded-md px-2 py-1.5 text-center font-mono text-xs ${colorClass} focus:outline-none focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] lg:h-[calc(100vh-6rem)] flex flex-col space-y-4 pb-16 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/components"
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex flex-wrap items-center gap-2">
              Studio of the Studio <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded border border-indigo-500/30">Compound Builder</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">Procedurally build multi-layered components.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#111216] hover:bg-[#181A1D] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs transition-colors"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target:</span>
              <span className="font-semibold text-white">
                {targetChassis === 'all' ? 'All' :
                  targetChassis === 'compact-classic' ? 'Compact' :
                    targetChassis === 'standard-highroof' ? 'Standard' : 'Maxi Bus'}
              </span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
 
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#181A1D] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-1 flex flex-col">
                  {[
                    { id: 'all', label: 'All Chassis (Generic)' },
                    { id: 'compact-classic', label: 'Compact Class' },
                    { id: 'standard-highroof', label: 'Standard Class' },
                    { id: 'maxi-bus', label: 'Maxi Bus Class' }
                  ].map(chassis => (
                    <button
                      key={chassis.id}
                      onClick={() => { setTargetChassis(chassis.id); setIsDropdownOpen(false); }}
                      className={`px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors flex items-center justify-between ${targetChassis === chassis.id
                        ? 'bg-sky-500/10 text-sky-400'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {chassis.label}
                      {targetChassis === chassis.id && <Check size={16} className="text-sky-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 font-bold px-4 py-2.5 rounded-lg flex items-center transition-all"
          >
            Import AI Build
          </button>

          <button
            onClick={() => handleSave(false)}
            className="bg-sky-500 hover:bg-sky-400 text-sky-950 font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            <Save size={18} />
            Save Changes
          </button>
          
          <button
            onClick={() => handleSave(true)}
            className="bg-[#111216] hover:bg-[#181A1D] border border-sky-500/30 text-sky-400 font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <Copy size={18} />
            Save as Copy
          </button>
        </div>
      </div>
      {/* Mobile Tab Switcher Bar (< 1024px) */}
      <div className="lg:hidden flex bg-[#111216] p-1.5 rounded-xl border border-white/10 shrink-0 gap-1 z-20">
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            mobileTab === 'preview' ? 'bg-sky-500 text-sky-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          3D Preview
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('specs')}
          className={`flex-1 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            mobileTab === 'specs' ? 'bg-sky-500 text-sky-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Sliders & Specs
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('parts')}
          className={`flex-1 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            mobileTab === 'parts' ? 'bg-sky-500 text-sky-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Parts Stack
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

        {/* Left: Live 3D Preview Canvas */}
        <div className={`flex-grow h-[55vh] lg:h-full bg-[#111216] border border-white/10 rounded-2xl overflow-hidden relative shadow-inner flex flex-col ${
          mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur border border-white/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200 tracking-wide">LIVE PREVIEW</span>
          </div>

          {/* State Toggle UI */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur border border-white/10 rounded-lg p-1">
              {states.map(stateName => (
                <button
                  key={stateName}
                  onClick={() => setActiveState(stateName)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${activeState === stateName
                    ? 'bg-sky-500 text-sky-950 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {stateName}
                </button>
              ))}

              {isAddingState ? (
                <div className="flex items-center ml-1">
                  <input
                    type="text"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    placeholder="e.g. open"
                    className="w-20 bg-[#0B0C10] border border-white/20 rounded-md px-2 py-1 text-xs text-white focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newStateName.trim() && !states.includes(newStateName.trim())) {
                        setStates([...states, newStateName.trim()]);
                        setActiveState(newStateName.trim());
                        setNewStateName('');
                        setIsAddingState(false);
                      } else if (e.key === 'Escape') {
                        setIsAddingState(false);
                      }
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingState(true)}
                  className="px-2 py-1.5 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 flex items-center transition-colors"
                  title="Add New State"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
            {activeState !== 'default' && (
              <div className="text-right">
                <span className="text-[10px] text-sky-400 font-medium bg-sky-900/40 px-2 py-0.5 rounded border border-sky-500/20">
                  Editing "{activeState}" state
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            <ComponentPreviewCanvas
              parts={parts}
              activePartId={activePartId}
              onSelectPart={setActivePartId}
              onOffsetUpdate={handleCanvasOffsetUpdate}
              onRotationUpdate={handleCanvasRotationUpdate}
              onDuplicate={handleDuplicatePart}
              activeState={activeState}
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center px-4 py-2 bg-black/50 backdrop-blur border border-white/10 rounded-xl">
            <span className="text-xs text-slate-400">Drag to orbit • Scroll to zoom</span>
            <div className="text-xs font-mono text-sky-400">
              {parts.length} Layer{parts.length !== 1 && 's'}
            </div>
          </div>
        </div>

        {/* Right Panel Wrapper */}
        <div className={`w-full lg:w-[42rem] flex flex-col lg:flex-row gap-6 shrink-0 h-full overflow-hidden ${
          mobileTab !== 'preview' ? 'flex' : 'hidden lg:flex'
        }`}>

          {/* Middle Column: Global & Layers Panel */}
          <div className={`w-full lg:w-64 flex flex-col gap-4 pr-2 pb-8 h-full min-h-0 ${
            mobileTab === 'parts' ? 'flex' : 'hidden lg:flex'
          }`}>

            {/* Global Component Name */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Component Blueprint</label>
              <input
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all font-semibold"
                placeholder="e.g., Luxury Swivel Table"
              />
            </div>

            {/* Category Selector */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              
              {isAddingCategory ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name..."
                    className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newCategoryName.trim()) {
                        const newCat = newCategoryName.trim();
                        if (!availableCategories.includes(newCat)) {
                          setAvailableCategories([...availableCategories, newCat]);
                        }
                        setCategory(newCat);
                        setNewCategoryName('');
                        setIsAddingCategory(false);
                      } else if (e.key === 'Escape') {
                        setIsAddingCategory(false);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (newCategoryName.trim()) {
                          const newCat = newCategoryName.trim();
                          if (!availableCategories.includes(newCat)) {
                            setAvailableCategories([...availableCategories, newCat]);
                          }
                          setCategory(newCat);
                        }
                        setNewCategoryName('');
                        setIsAddingCategory(false);
                      }}
                      className="flex-1 bg-sky-500/20 text-sky-400 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-sky-500/30"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsAddingCategory(false)}
                      className="flex-1 bg-white/5 text-slate-400 py-1.5 rounded-lg text-xs font-bold transition-colors hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full flex items-center justify-between bg-[#0B0C10] hover:bg-[#111216] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-colors"
                  >
                    <span className="truncate">{category || "Select a category"}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#181A1D] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                        {availableCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              setCategory(cat);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${category === cat ? 'bg-sky-500/10 text-sky-400 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="p-1 border-t border-white/10 bg-black/20">
                        <button
                          onClick={() => {
                            setIsAddingCategory(true);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sky-400 hover:text-white hover:bg-sky-500/20 rounded-lg transition-colors font-semibold"
                        >
                          <Plus size={14} />
                          Create New Category
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Layers Stack */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-sky-400" />
                  <h2 className="text-sm font-semibold text-white">Parts Stack</h2>
                </div>
                <button onClick={addPart} className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {parts.map(part => (
                  <div
                    key={part.id}
                    onClick={() => setActivePartId(part.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${activePartId === part.id
                      ? 'bg-sky-500/10 border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.1)]'
                      : 'bg-[#181A1D] border-white/5 hover:border-white/10'
                      }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: part.color }}
                    />
                    <input
                      type="text"
                      value={part.name}
                      onChange={(e) => updatePartName(part.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className={`bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm w-full font-medium ${activePartId === part.id ? 'text-sky-400' : 'text-slate-300'
                        }`}
                    />
                    {parts.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deletePart(part.id); }}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ opacity: activePartId === part.id ? 1 : undefined }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Properties for Active Part */}
          <div className={`flex-1 flex flex-col gap-5 overflow-y-auto pr-2 pb-8 custom-scrollbar ${
            mobileTab === 'specs' ? 'flex' : 'hidden lg:flex'
          }`}>

            <div className="bg-sky-500/5 border border-sky-500/10 rounded-lg p-3">
              <p className="text-xs text-sky-400 font-medium">Editing: {activePart.name}</p>
            </div>

            {/* Shape Toggle */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <BoxIcon size={16} className="text-slate-400" />
                <h2 className="text-sm font-semibold text-white">Primitive Shape</h2>
              </div>
              <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar snap-x">
                <button
                  onClick={() => updateActivePart({ shape: 'box' })}
                  className={`shrink-0 w-[calc(33.33%-0.5rem)] snap-start flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${activePart.shape === 'box'
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                    : 'bg-[#0B0C10] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                    }`}
                >
                  <BoxIcon size={20} />
                  <span className="text-xs font-semibold">Box</span>
                </button>
                <button
                  onClick={() => updateActivePart({ shape: 'cylinder' })}
                  className={`shrink-0 w-[calc(33.33%-0.5rem)] snap-start flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${activePart.shape === 'cylinder'
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                    : 'bg-[#0B0C10] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                    }`}
                >
                  <Cylinder size={20} />
                  <span className="text-xs font-semibold">Cyl</span>
                </button>
                <button
                  onClick={() => updateActivePart({ shape: 'wedge' })}
                  className={`shrink-0 w-[calc(33.33%-0.5rem)] snap-start flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${activePart.shape === 'wedge'
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                    : 'bg-[#0B0C10] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                    }`}
                >
                  <Triangle size={20} />
                  <span className="text-xs font-semibold">Wedge</span>
                </button>
                <button
                  onClick={() => updateActivePart({ shape: 'sphere' })}
                  className={`shrink-0 w-[calc(33.33%-0.5rem)] snap-start flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all ${activePart.shape === 'sphere'
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                    : 'bg-[#0B0C10] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                    }`}
                >
                  <Circle size={20} />
                  <span className="text-xs font-semibold">Sphere</span>
                </button>
              </div>
            </div>

            {/* Visibility States */}
            {states.length > 1 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Layers size={16} className="text-slate-400" />
                  <h2 className="text-sm font-semibold text-white">Visible In States</h2>
                </div>
                <p className="text-xs text-slate-400">Select which states this part is visible in.</p>
                <div className="flex flex-wrap gap-2">
                  {states.map(stateName => {
                    const isVisible = activePart.visibleInStates ? activePart.visibleInStates.includes(stateName) : true;
                    return (
                      <button
                        key={stateName}
                        onClick={() => {
                          let currentVis = activePart.visibleInStates || [...states];
                          if (isVisible) {
                            currentVis = currentVis.filter(s => s !== stateName);
                          } else {
                            currentVis = [...currentVis, stateName];
                          }
                          if (currentVis.length === states.length) currentVis = undefined;
                          updateActivePart({ visibleInStates: currentVis });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${isVisible
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-[#0B0C10] text-slate-500 border border-white/5'
                          }`}
                      >
                        {stateName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dimensions Sliders */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-emerald-400" />
                  <h2 className="text-sm font-semibold text-white">Dimensions</h2>
                </div>
                <div className="flex bg-[#0B0C10] rounded-lg border border-white/10 overflow-hidden shadow-inner">
                  <button
                    onClick={() => handleCopy('dim', activePart.size)}
                    className="flex items-center justify-center w-8 h-7 text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors border-r border-white/10"
                    title="Copy [X,Y,Z]"
                  >
                    {copiedDim ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => handlePaste('dim')}
                    className="flex items-center justify-center w-8 h-7 text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                    title="Paste [X,Y,Z]"
                  >
                    <ClipboardPaste size={12} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {renderSliderControl({
                  label: "Length (X)",
                  value: activePart.size[0],
                  onChange: (val) => handleDimensionChange(0, val),
                  min: 1, max: 1000,
                  colorClass: "text-emerald-400",
                  bgClass: "accent-emerald-500"
                })}
                {renderSliderControl({
                  label: activePart.shape === 'cylinder' ? 'Diameter (Z)' : 'Width (Z)',
                  value: activePart.size[1],
                  onChange: (val) => handleDimensionChange(1, val),
                  min: 1, max: 1000,
                  colorClass: "text-emerald-400",
                  bgClass: "accent-emerald-500"
                })}
                {renderSliderControl({
                  label: "Height (Y)",
                  value: activePart.size[2],
                  onChange: (val) => handleDimensionChange(2, val),
                  min: 1, max: 1000,
                  colorClass: "text-emerald-400",
                  bgClass: "accent-emerald-500"
                })}
              </div>
            </div>

            {/* Text Input (Only for text shape) */}
            {activePart.shape === 'text' && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 shrink-0">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Type size={16} className="text-amber-400" />
                    <h2 className="text-sm font-semibold text-white">Text Content</h2>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={activePart.textString || ''}
                    onChange={(e) => updateActivePart({ textString: e.target.value })}
                    className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Enter text..."
                  />
                  <select 
                    value={activePart.fontUrl || ''} 
                    onChange={(e) => updateActivePart({ fontUrl: e.target.value })}
                    className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors mt-1"
                  >
                    <option value="">Default (Inter)</option>
                    <option value="https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-all-400-normal.woff">Roboto</option>
                    <option value="https://cdn.jsdelivr.net/npm/@fontsource/oswald@5.0.8/files/oswald-all-700-normal.woff">Oswald (Bold)</option>
                    <option value="https://cdn.jsdelivr.net/npm/@fontsource/pacifico@5.0.8/files/pacifico-all-400-normal.woff">Pacifico (Handwriting)</option>
                    <option value="https://cdn.jsdelivr.net/npm/@fontsource/vt323@5.0.8/files/vt323-all-400-normal.woff">VT323 (Pixel)</option>
                  </select>
                  <p className="text-[10px] text-slate-500">Size (X) controls font size.</p>
                </div>
              </div>
            )}

            {/* Offset Sliders */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Move size={16} className="text-indigo-400" />
                  <h2 className="text-sm font-semibold text-white">Relative Offsets</h2>
                </div>
                <div className="flex bg-[#0B0C10] rounded-lg border border-white/10 overflow-hidden shadow-inner">
                  <button
                    onClick={() => handleCopy('offset', activePart.offset)}
                    className="flex items-center justify-center w-8 h-7 text-slate-400 hover:text-indigo-400 hover:bg-white/5 transition-colors border-r border-white/10"
                    title="Copy [X,Y,Z]"
                  >
                    {copiedOffset ? <Check size={12} className="text-indigo-400" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => handlePaste('offset')}
                    className="flex items-center justify-center w-8 h-7 text-slate-400 hover:text-indigo-400 hover:bg-white/5 transition-colors"
                    title="Paste [X,Y,Z]"
                  >
                    <ClipboardPaste size={12} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {renderSliderControl({
                  label: "Offset X",
                  value: getArrayValue(activePart, 'offset')[0],
                  onChange: (val) => handleOffsetChange(0, val),
                  min: -1000, max: 1000,
                  colorClass: "text-indigo-400",
                  bgClass: "accent-indigo-500"
                })}
                {renderSliderControl({
                  label: "Offset Y",
                  value: getArrayValue(activePart, 'offset')[1],
                  onChange: (val) => handleOffsetChange(1, val),
                  min: -1000, max: 1000,
                  colorClass: "text-indigo-400",
                  bgClass: "accent-indigo-500"
                })}
                {renderSliderControl({
                  label: "Offset Z",
                  value: getArrayValue(activePart, 'offset')[2],
                  onChange: (val) => handleOffsetChange(2, val),
                  min: -1000, max: 1000,
                  colorClass: "text-indigo-400",
                  bgClass: "accent-indigo-500"
                })}
              </div>
            </div>

            {/* Rotation Sliders */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <RotateCw size={16} className="text-amber-400" />
                  <h2 className="text-sm font-semibold text-white">Rotation</h2>
                </div>
                <div className="flex bg-[#0B0C10] rounded-lg border border-white/10 overflow-hidden shadow-inner">
                  <button
                    onClick={() => handleCopy('rot', activePart.rotation)}
                    className="flex items-center justify-center w-8 h-7 text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors border-r border-white/10"
                    title="Copy [X,Y,Z]"
                  >
                    {copiedRot ? <Check size={12} className="text-amber-400" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => handlePaste('rot')}
                    className="flex items-center justify-center w-8 h-7 text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
                    title="Paste [X,Y,Z]"
                  >
                    <ClipboardPaste size={12} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {renderSliderControl({
                  label: "Pitch (X)",
                  value: getArrayValue(activePart, 'rotation')[0],
                  onChange: (val) => handleRotationChange(0, val),
                  min: -360, max: 360,
                  colorClass: "text-amber-400",
                  bgClass: "accent-amber-500"
                })}
                {renderSliderControl({
                  label: "Yaw (Y)",
                  value: getArrayValue(activePart, 'rotation')[1],
                  onChange: (val) => handleRotationChange(1, val),
                  min: -360, max: 360,
                  colorClass: "text-amber-400",
                  bgClass: "accent-amber-500"
                })}
                {renderSliderControl({
                  label: "Roll (Z)",
                  value: getArrayValue(activePart, 'rotation')[2],
                  onChange: (val) => handleRotationChange(2, val),
                  min: -360, max: 360,
                  colorClass: "text-amber-400",
                  bgClass: "accent-amber-500"
                })}
              </div>
            </div>

            {/* Material */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 shrink-0">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-amber-400" />
                  <h2 className="text-sm font-semibold text-white">Material Color</h2>
                </div>
              </div>

              {/* Preset Swatches */}
              <div className="grid grid-cols-6 gap-2">
                {[
                  '#4b5563', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                  '#ec4899', '#000000', '#ffffff', '#d4d4d8', '#78716c', '#d97706'
                ].map(color => (
                  <button
                    key={color}
                    onClick={() => updateActivePart({ color })}
                    className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-110 shadow-sm ${activePart.color.toLowerCase() === color ? 'border-amber-400 scale-110 z-10' : 'border-transparent hover:border-white/30'
                      }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Custom Input & Sync Toggle */}
              <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
                <div className="flex gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-colors shrink-0 group focus-within:border-amber-400" style={{ borderColor: activePart.color }}>
                    <input type="color" value={activePart.color} onChange={(e) => updateActivePart({ color: e.target.value })} className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0" />
                    <div className="w-full h-full" style={{ backgroundColor: activePart.color }} />
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <span className="absolute left-3 text-slate-500 font-mono">#</span>
                    <input
                      type="text"
                      value={activePart.color.replace('#', '').toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[0-9A-F]{0,6}$/i.test(val)) {
                          updateActivePart({ color: '#' + val });
                        }
                      }}
                      className="bg-[#0B0C10] border border-white/10 rounded-lg pl-8 pr-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-amber-500 w-full font-mono uppercase transition-colors"
                      maxLength={6}
                      placeholder="HEX"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-1 group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activePart.isColorable ? 'bg-amber-500 border-amber-500' : 'border-slate-600 bg-transparent group-hover:border-slate-400'}`}>
                    {activePart.isColorable && <Check size={12} className="text-[#0B0C10]" />}
                  </div>
                  <input type="checkbox" checked={!!activePart.isColorable} onChange={(e) => updateActivePart({ isColorable: e.target.checked })} className="hidden" />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Allow Studio Color Change</span>
                </label>
              </div>
            </div>

            {/* Surface Properties */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 shrink-0">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <BoxIcon size={16} className="text-teal-400" />
                  <h2 className="text-sm font-semibold text-white">Surface Finish</h2>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                {renderSliderControl({
                  label: "Opacity (%)",
                  value: Math.round((activePart.opacity ?? 1) * 100) || 0,
                  onChange: (val) => updateActivePart({ opacity: Number(val) / 100 }),
                  min: 0, max: 100,
                  colorClass: "text-teal-400",
                  bgClass: "accent-teal-500"
                })}
                {renderSliderControl({
                  label: "Metalness (%)",
                  value: Math.round((activePart.metalness ?? 0.2) * 100) || 0,
                  onChange: (val) => updateActivePart({ metalness: Number(val) / 100 }),
                  min: 0, max: 100,
                  colorClass: "text-teal-400",
                  bgClass: "accent-teal-500"
                })}
                {renderSliderControl({
                  label: "Roughness (%)",
                  value: Math.round((activePart.roughness ?? 0.7) * 100) || 0,
                  onChange: (val) => updateActivePart({ roughness: Number(val) / 100 }),
                  min: 0, max: 100,
                  colorClass: "text-teal-400",
                  bgClass: "accent-teal-500"
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
      `}} />

      {/* AI Import Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111216] border border-white/10 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl mt-[-2px]">✨</span> Import AI Build
                </h3>
                <p className="text-sm text-slate-400 mt-1">Paste the exact output from ChatGPT or Claude below.</p>
              </div>
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 bg-[#0B0C10] flex flex-col gap-4">
              <button
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setAiInput(text);
                  } catch (err) {
                    alert("Could not read clipboard. Please click inside the box and press Ctrl+V.");
                  }
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-xl py-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ClipboardPaste size={24} />
                <span className="font-bold">Click here to Auto-Paste from Clipboard</span>
                <span className="text-xs text-slate-500">Or click the text box below and press Ctrl+V</span>
              </button>

              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Paste the AI's response here..."
                className="w-full h-64 bg-[#181A1D] border border-white/10 rounded-xl p-4 text-sm font-mono text-sky-200 focus:outline-none focus:border-indigo-500/50 resize-none placeholder:text-slate-600"
                spellCheck="false"
              />
            </div>

            <div className="p-6 border-t border-white/5 bg-[#111216] flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${aiImportAppend ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 bg-transparent group-hover:border-slate-400'}`}>
                  {aiImportAppend && <Check size={12} className="text-white" />}
                </div>
                <input type="checkbox" checked={aiImportAppend} onChange={(e) => setAiImportAppend(e.target.checked)} className="hidden" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Append to existing parts (don't overwrite)</span>
              </label>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportAiCode}
                  disabled={!aiInput.trim()}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                >
                  Build Component
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
