"use client";
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';

export default function SlidingFooter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sleek Floating Action Button in the bottom-left corner */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[110] w-12 h-12 bg-[#181A1D]/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-sand hover:text-white hover:bg-white/10 hover:scale-105 transition-all shadow-lg group"
        title="Info & Contact"
      >
        {isOpen ? <ChevronDown size={20} /> : <span className="font-bold text-xs tracking-widest uppercase">Info</span>}
      </button>

      {/* The Sliding Glass Drawer */}
      <div 
        className={`fixed bottom-0 left-0 w-full z-[100] bg-[#0F1115]/95 backdrop-blur-xl border-t border-white/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            
            {/* Column 1: Brand */}
            <div className="col-span-1 md:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold tracking-wider text-white">
                KOUINI <span className="text-sand">CARAVANE</span>
              </h2>
              <p className="text-white/50 text-sm leading-relaxed pr-4">
                The premier destination for authentic, off-grid Algerian campervan conversions. Built for the wildest journeys.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold tracking-widest text-sand uppercase">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Build Studio</a></li>
                <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Expedition Fleet</a></li>
                <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Engineering & Materials</a></li>
                <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Our Story</a></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold tracking-widest text-sand uppercase">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
                  <MapPin size={16} className="mt-0.5 text-sand shrink-0" />
                  <span>Shipping to all 58 Wilayas<br/>Algiers, Algeria</span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
                  <Phone size={16} className="text-sand shrink-0" />
                  <span>+213 795 643 591</span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors cursor-pointer">
                  <Mail size={16} className="text-sand shrink-0" />
                  <span>contact@kouinicaravane.dz</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Socials Placeholder */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold tracking-widest text-sand uppercase">Follow Our Journey</h3>
              <p className="text-white/40 text-xs">Stay tuned for our social media updates coming soon.</p>
            </div>

          </div>

          {/* Bottom Bar: Developer Credit */}
          <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs">
              Built with passion by <span className="font-bold text-white hover:text-sand cursor-pointer transition-colors">Abdelhadi Hammaz</span>.
            </p>
            <p className="text-white/40 text-xs">
              &copy; {new Date().getFullYear()} Kouini Caravane. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      {/* Overlay to dim background when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-500 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
