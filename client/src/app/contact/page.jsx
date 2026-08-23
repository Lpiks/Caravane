"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import { submitInquiry } from "@/lib/api";
import { MapPin, Phone, Mail, Send, CheckCircle2, ChevronRight, Globe, AlertTriangle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', chassis: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chassisOptions = [
    { value: "", label: "Select a vehicle platform (Optional)" },
    { value: "vw-t3", label: "Volkswagen T3 Classic" },
    { value: "renault-master", label: "Renault Master High-Roof" },
    { value: "toyota-coaster", label: "Toyota Coaster Minibus" },
    { value: "custom", label: "Provide my own vehicle" }
  ];

  const selectedChassisLabel = chassisOptions.find(opt => opt.value === formData.chassis)?.label || chassisOptions[0].label;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitInquiry({ ...formData, source: 'contact' });
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', chassis: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="relative min-h-screen text-linen overflow-hidden bg-obsidian">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 grayscale mix-blend-luminosity" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1610214640954-c941e737190d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }} 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian via-obsidian/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent" />
      </div>

      <Navbar />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col lg:flex-row gap-16">
        
        {/* Left Column: Workshop HQ Info */}
        <div className="flex-1 flex flex-col gap-12">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-terracotta font-mono text-xs tracking-widest">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              SECURE COMM_CHANNEL
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-linen drop-shadow-lg">
              Workshop HQ
            </h1>
            <p className="text-sm md:text-base text-sand/80 max-w-md font-mono leading-relaxed uppercase tracking-widest mt-2 border-l-2 border-terracotta/30 pl-4">
              Every Kouini Caravane is conceptualized, engineered, and built in our Algiers workshop. 
              Schedule a visit to witness the craftsmanship firsthand.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-terracotta font-mono text-xs tracking-widest uppercase">
                <MapPin size={14} /> Coordinates
              </div>
              <div className="text-linen font-mono text-sm leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10">
                Zone Industrielle Chéraga<br/>16014 Algiers, Algeria
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-terracotta font-mono text-xs tracking-widest uppercase">
                <Phone size={14} /> Voice / Text
              </div>
              <div className="text-linen font-mono text-sm bg-white/5 p-4 rounded-lg border border-white/10 flex items-center h-full">
                +213 555 12 34 56
              </div>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center gap-2 text-terracotta font-mono text-xs tracking-widest uppercase">
                <Mail size={14} /> Uplink Data
              </div>
              <div className="text-linen font-mono text-sm bg-white/5 p-4 rounded-lg border border-white/10">
                builds@kouinicaravane.dz
              </div>
            </div>
          </div>

          {/* Radar / Map Widget */}
          <div className="w-full h-48 bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative group">
            {/* Radar Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            
            {/* Concentric Radar Rings */}
            <div className="absolute w-[200%] aspect-square rounded-full border border-terracotta/10 scale-[0.2]" />
            <div className="absolute w-[200%] aspect-square rounded-full border border-terracotta/10 scale-[0.4]" />
            <div className="absolute w-[200%] aspect-square rounded-full border border-terracotta/10 scale-[0.6]" />
            <div className="absolute w-[200%] aspect-square rounded-full border border-terracotta/10 scale-[0.8]" />
            
            {/* Sweeping Radar Line */}
            <div className="absolute top-1/2 left-1/2 w-full h-[2px] origin-left bg-gradient-to-r from-terracotta/0 via-terracotta/50 to-terracotta animate-[spin_4s_linear_infinite]" />
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <Globe size={32} className="text-terracotta drop-shadow-[0_0_10px_rgba(224,122,95,0.8)]" />
              <span className="text-terracotta font-mono font-bold uppercase tracking-widest text-xs bg-obsidian/80 px-4 py-1 border border-terracotta/30">
                Tracking HQ Signal...
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Mission Control Form */}
        <div className="flex-1">
          <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 overflow-hidden h-full">
            
            {/* Corner UI Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-terracotta/50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-terracotta/50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-terracotta/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-terracotta/50" />

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-sand mb-8 border-b border-white/5 pb-6">
              Request Consultation
            </h2>
            
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle2 size={80} className="text-terracotta mb-6 drop-shadow-[0_0_15px_rgba(224,122,95,0.5)]" />
                <h3 className="text-3xl font-black uppercase tracking-tighter text-linen mb-2">Transmission Successful</h3>
                <p className="text-linen/60 font-mono text-sm max-w-sm leading-relaxed mb-12">
                  HQ has received your telemetry. Our engineering team is analyzing your requirements and will initiate contact shortly.
                </p>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="text-terracotta font-mono font-bold uppercase text-xs tracking-widest border-b border-terracotta/30 hover:border-terracotta transition-colors pb-1"
                >
                  Send Additional Data
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1 relative group">
                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-sand/60">Operative Name *</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 py-3 text-linen focus:border-terracotta focus:bg-white/5 outline-none transition-all placeholder:text-white/20 font-mono text-sm" placeholder="Yanis B." />
                  </div>
                  <div className="flex flex-col gap-1 relative group">
                    <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-sand/60">Comms Frequency (Phone) *</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-transparent border-b border-white/20 py-3 text-linen focus:border-terracotta focus:bg-white/5 outline-none transition-all placeholder:text-white/20 font-mono text-sm" placeholder="+213..." />
                  </div>
                </div>

                <div className="flex flex-col gap-1 relative group">
                  <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-sand/60">Digital Uplink (Email)</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-transparent border-b border-white/20 py-3 text-linen focus:border-terracotta focus:bg-white/5 outline-none transition-all placeholder:text-white/20 font-mono text-sm" placeholder="operative@domain.com" />
                </div>

                <div className="flex flex-col gap-1 relative group" ref={dropdownRef}>
                  <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-sand/60">Target Chassis Platform</label>
                  <div 
                    className="w-full bg-transparent border-b border-white/20 py-3 text-linen focus:border-terracotta focus:bg-white/5 outline-none transition-all font-mono text-sm cursor-pointer flex justify-between items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className={!formData.chassis ? "text-white/40" : "text-linen"}>{selectedChassisLabel}</span>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-[100%] mt-2 left-0 right-0 bg-[#1c1e22]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-sm overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                      {chassisOptions.map((opt) => (
                        <div 
                          key={opt.value}
                          className={`px-4 py-3 cursor-pointer font-mono text-sm transition-colors hover:bg-terracotta hover:text-obsidian ${formData.chassis === opt.value ? 'bg-white/5 text-terracotta' : 'text-linen'}`}
                          onClick={() => {
                            setFormData({ ...formData, chassis: opt.value });
                            setIsDropdownOpen(false);
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 relative group">
                  <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-sand/60">Mission Parameters *</label>
                  <textarea required name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full bg-transparent border-b border-white/20 py-3 text-linen focus:border-terracotta focus:bg-white/5 outline-none transition-all placeholder:text-white/20 font-mono text-sm resize-none" placeholder="Detail your overland requirements and payload needs..."></textarea>
                </div>

                <div className="mt-8">
                  <button disabled={status === 'submitting'} type="submit" className="w-full py-4 bg-transparent border border-terracotta/50 text-terracotta rounded-sm font-mono uppercase tracking-widest text-xs hover:bg-terracotta hover:text-obsidian transition-all flex items-center justify-center gap-3 group/btn relative overflow-hidden disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-terracotta">
                    <div className="absolute inset-0 bg-terracotta translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 ease-out z-0" />
                    <span className="relative z-10 flex items-center gap-2">
                      {status === 'submitting' ? 'TRANSMITTING...' : 'INITIALIZE UPLINK'} 
                      {status === 'submitting' ? <AlertTriangle size={14} className="animate-pulse" /> : <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />}
                    </span>
                  </button>
                  {status === 'error' && (
                    <div className="text-terracotta/80 font-mono text-xs font-bold mt-4 text-center uppercase tracking-widest bg-terracotta/10 py-2 border border-terracotta/20">
                      Transmission Failed. Check Signal & Retry.
                    </div>
                  )}
                </div>
              </form>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
