"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, UploadCloud, Plus, Image as ImageIcon, ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, name, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div 
      className="relative" 
      tabIndex={0} 
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} flex items-center justify-between cursor-pointer select-none`}
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={16} className={`text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#121417] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map(opt => (
            <div 
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value === opt.value 
                  ? 'bg-sky-500/20 text-sky-400 font-medium' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdminFleetEditorPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'sale',
    chassis: '',
    price: '',
    fullDescription: '',
    status: 'available',
    specs: {
      sleeps: 2,
      solarWatts: 0,
      waterLiters: 0,
      transmission: 'Manual'
    },
    images: []
  });
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([null, null, null, null]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const newImages = [...(prev.images || [])];
          newImages[0] = reader.result;
          return { ...prev, images: newImages };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setGalleryPreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[index] = URL.createObjectURL(file);
        return newPreviews;
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const newImages = [...(prev.images || [])];
          newImages[index + 1] = reader.result;
          return { ...prev, images: newImages };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!isNew) {
      const fetchVehicle = async () => {
        try {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
          
          const res = await fetch(`${API_URL}/vehicles`);
          const data = await res.json();
          const vehicle = data.find(v => v._id === resolvedParams.id);
          
          if (vehicle) {
            setFormData({
              title: vehicle.title || '',
              type: vehicle.type || 'sale',
              chassis: vehicle.chassis || '',
              price: vehicle.price || '',
              fullDescription: vehicle.fullDescription || '',
              status: vehicle.status || 'available',
              specs: {
                sleeps: vehicle.specs?.sleeps || 2,
                solarWatts: vehicle.specs?.solarWatts || 0,
                waterLiters: vehicle.specs?.waterLiters || 0,
                transmission: vehicle.specs?.transmission || 'Manual'
              },
              images: vehicle.images || []
            });
            if (vehicle.images && vehicle.images.length > 0) {
              setMainImagePreview(vehicle.images[0]);
              setGalleryPreviews([
                vehicle.images[1] || null,
                vehicle.images[2] || null,
                vehicle.images[3] || null,
                vehicle.images[4] || null,
              ]);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [isNew, resolvedParams.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specs.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: ['sleeps', 'solarWatts', 'waterLiters'].includes(specField) ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
      
      const url = isNew ? `${API_URL}/vehicles` : `${API_URL}/vehicles/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push('/admin/fleet');
        }, 1200);
      } else {
        const errorData = await res.json();
        alert('Error saving vehicle: ' + (errorData.message || 'Unknown error'));
        setSaving(false);
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving vehicle.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-sky-500 animate-spin"></div>
        <div className="text-white/50 text-xs font-mono uppercase tracking-widest animate-pulse">Loading Vehicle Record</div>
      </div>
    );
  }

  const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-linen placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-inner";
  const labelClass = "block text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] mb-2";

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white/5 to-transparent p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <Link 
            href="/admin/fleet"
            className="w-10 h-10 flex items-center justify-center bg-black/40 border border-white/10 hover:border-white/20 rounded-full text-white/50 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">{isNew ? 'New Fleet Unit' : 'Edit Fleet Unit'}</h1>
            <p className="text-xs text-white/40 font-mono tracking-wider mt-1">UNIT_ID // {isNew ? 'PENDING_CREATION' : resolvedParams.id}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving || saveSuccess}
          className={`group relative overflow-hidden inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            saveSuccess 
              ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]'
          }`}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative z-10 flex items-center gap-2">
            <Save size={16} />
            {saving ? 'Transmitting...' : saveSuccess ? 'Saved Successfully!' : 'Commit Changes'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Basic Info Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-xs font-bold text-sky-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                Core Identification
              </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Vehicle Title</label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange}
                  placeholder="e.g. Mercedes Sprinter 4x4"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Chassis Base</label>
                <input 
                  type="text" name="chassis" value={formData.chassis} onChange={handleChange}
                  placeholder="e.g. VW Crafter L3H2"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Price / Rate</label>
                <input 
                  type="text" name="price" value={formData.price} onChange={handleChange}
                  placeholder="e.g. DZD 12,500,000 or $180/day"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Deployment Type</label>
                <CustomSelect 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className={inputClass}
                  options={[
                    { value: 'sale', label: 'Retail (For Sale)' },
                    { value: 'rental', label: 'Expedition Rental' }
                  ]}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Marketing Description</label>
                <textarea 
                  rows="4" name="fullDescription" value={formData.fullDescription} onChange={handleChange}
                  className={inputClass}
                  placeholder="Premium off-grid camper van ready for your next adventure..."
                ></textarea>
              </div>
            </div>
            </div>
          </div>

          {/* Specs Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-terracotta/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-xs font-bold text-terracotta uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-terracotta"></div>
                Technical Specifications
              </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>Solar (W)</label>
                <input 
                  type="number" name="specs.solarWatts" value={formData.specs.solarWatts} onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Water (L)</label>
                <input 
                  type="number" name="specs.waterLiters" value={formData.specs.waterLiters} onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Berths</label>
                <input 
                  type="number" name="specs.sleeps" value={formData.specs.sleeps} onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Gearbox</label>
                <CustomSelect 
                  name="specs.transmission" 
                  value={formData.specs.transmission} 
                  onChange={handleChange}
                  className={inputClass}
                  options={[
                    { value: 'Manual', label: 'Manual' },
                    { value: 'Automatic', label: 'Automatic' },
                    { value: 'Manual 4WD', label: 'Manual 4WD' },
                    { value: 'Automatic 4WD', label: 'Auto 4WD' }
                  ]}
                />
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media Gallery */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                Media Assets
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Main Image Dropzone */}
              <label className="group relative aspect-[4/3] bg-black/40 border-2 border-dashed border-white/10 hover:border-sky-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
                
                {mainImagePreview ? (
                  <>
                    <img src={mainImagePreview} alt="Main" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10">
                      <UploadCloud className="text-white mb-2" size={24} />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <ImageIcon className="text-white/20 group-hover:text-sky-400 mb-3 transition-colors" size={32} />
                    <span className="text-xs font-bold text-white/50 group-hover:text-white uppercase tracking-widest transition-colors">Hero Image</span>
                    <span className="text-[10px] text-white/30 mt-1">Click to browse</span>
                  </>
                )}
              </label>

              {/* Smaller Gallery items */}
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <label key={i} className="group relative aspect-square bg-black/40 border-2 border-dashed border-white/10 hover:border-sky-500/30 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all text-white/30 hover:text-sky-400 overflow-hidden">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryImageChange(i, e)} />
                    {galleryPreviews[i] ? (
                      <>
                        <img src={galleryPreviews[i]} alt={`Gallery ${i+1}`} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                          <UploadCloud className="text-white" size={20} />
                        </div>
                      </>
                    ) : (
                      <>
                        <Plus size={20} className="mb-2" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Image {i+1}</span>
                      </>
                    )}
                  </label>
                ))}
              </div>
              
              <label className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 cursor-pointer group">
                <input type="file" accept="image/*" multiple className="hidden" />
                <UploadCloud size={16} className="text-sky-400 group-hover:text-white transition-colors" />
                Bulk Upload
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
