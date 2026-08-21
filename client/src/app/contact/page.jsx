"use client";
import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { submitInquiry } from "@/lib/api";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', chassis: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

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
    <div className="bg-obsidian min-h-screen text-linen">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-6 pt-32 pb-16 flex flex-col lg:flex-row gap-16">
        
        {/* Left Column: Workshop HQ Info */}
        <div className="flex-1 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-sand mb-4">
              Workshop HQ
            </h1>
            <p className="text-sm md:text-base font-medium text-linen/70 max-w-md font-mono leading-relaxed">
              Every Kouini Caravane is conceptualized, engineered, and built in our Algiers workshop. 
              Schedule a visit to see the craftsmanship firsthand.
            </p>
          </div>

          <div className="flex flex-col gap-6 bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <MapPin size={24} className="text-terracotta shrink-0" />
              <div>
                <div className="font-bold uppercase tracking-widest text-sm text-sand mb-1">Location</div>
                <div className="text-linen/80 font-mono text-sm leading-relaxed">Zone Industrielle Chéraga<br/>16014 Algiers, Algeria</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone size={24} className="text-terracotta shrink-0" />
              <div>
                <div className="font-bold uppercase tracking-widest text-sm text-sand mb-1">Phone / WhatsApp</div>
                <div className="text-linen/80 font-mono text-sm">+213 555 12 34 56</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail size={24} className="text-terracotta shrink-0" />
              <div>
                <div className="font-bold uppercase tracking-widest text-sm text-sand mb-1">Email</div>
                <div className="text-linen/80 font-mono text-sm">builds@kouinicaravane.dz</div>
              </div>
            </div>
          </div>

          {/* Simple Map Placeholder (Real embed would go here) */}
          <div className="w-full h-48 bg-[#2a2d32] rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] mix-blend-overlay pointer-events-none"></div>
            <MapPin size={32} className="text-white/20 absolute" />
            <span className="text-white/30 font-bold uppercase tracking-widest text-xs z-10 bg-obsidian/50 px-3 py-1 rounded">Map View Disabled</span>
          </div>
        </div>

        {/* Right Column: Consultation Form */}
        <div className="flex-1 bg-[#1c1e22] rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-sand mb-8">Request a Consultation</h2>
          
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <CheckCircle2 size={64} className="text-oasis mb-6" />
              <h3 className="text-2xl font-bold text-linen mb-2">Inquiry Received</h3>
              <p className="text-linen/60 font-mono text-sm max-w-sm">
                Thank you. Our engineering team will review your request and contact you via phone or WhatsApp shortly.
              </p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-terracotta font-bold uppercase text-xs tracking-widest hover:underline">Submit another inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-sand/60">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-obsidian border border-white/10 rounded-lg p-4 text-linen focus:border-terracotta outline-none transition-colors" placeholder="Yanis B." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-sand/60">Phone Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-obsidian border border-white/10 rounded-lg p-4 text-linen focus:border-terracotta outline-none transition-colors" placeholder="+213..." />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-sand/60">Email Address</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-obsidian border border-white/10 rounded-lg p-4 text-linen focus:border-terracotta outline-none transition-colors" placeholder="name@domain.com" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-sand/60">Chassis Interest</label>
                <select name="chassis" value={formData.chassis} onChange={handleChange} className="w-full bg-obsidian border border-white/10 rounded-lg p-4 text-linen focus:border-terracotta outline-none transition-colors appearance-none">
                  <option value="">Select a vehicle platform (Optional)</option>
                  <option value="vw-t3">Volkswagen T3 Classic</option>
                  <option value="renault-master">Renault Master High-Roof</option>
                  <option value="toyota-coaster">Toyota Coaster Minibus</option>
                  <option value="custom">Provide my own vehicle</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-sand/60">Project Details *</label>
                <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-obsidian border border-white/10 rounded-lg p-4 text-linen focus:border-terracotta outline-none transition-colors resize-none" placeholder="Tell us about your overland goals..."></textarea>
              </div>

              <button disabled={status === 'submitting'} type="submit" className="w-full mt-4 bg-terracotta text-linen py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-terracotta/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50">
                {status === 'submitting' ? 'Sending...' : 'Send Inquiry'} <Send size={18} />
              </button>
              {status === 'error' && <div className="text-red-400 text-sm font-bold mt-2 text-center">An error occurred. Please try again.</div>}
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
