"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Hammer, Map, Truck, Phone, Home, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Studio", href: "/studio", icon: Hammer },
    { name: "Eng", href: "/craft", icon: Truck },
    { name: "Expeditions", href: "/expeditions", icon: Map },
    { name: "Fleet", href: "/fleet", icon: Compass },
  ];

  return (
    <>
      <div className="fixed top-3 left-0 w-full z-50 flex justify-center px-3 sm:px-4 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-5xl bg-obsidian/80 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-2 flex items-center justify-between shadow-2xl relative">
          
          {/* LOGO */}
          <div className="pl-4 sm:pl-6 pr-2 sm:pr-4 flex items-center relative z-10">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg sm:text-xl font-black tracking-widest uppercase text-white hover:text-terracotta transition-colors"
            >
              Kouini
            </Link>
          </div>

          {/* DESKTOP PILL LINKS (Segmented Control Style) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 p-1.5 bg-black/40 rounded-full border border-white/5 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-obsidian shadow-sm scale-100' 
                      : 'text-white/60 hover:text-white hover:bg-white/10 scale-95 hover:scale-100'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-terracotta' : ''} /> {link.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT ACTIONS: CONTACT & MOBILE TOGGLE */}
          <div className="flex items-center gap-2 pr-1 relative z-10">
            <Link 
              href="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-terracotta text-white rounded-[1.2rem] sm:rounded-[1.5rem] uppercase tracking-widest text-[11px] sm:text-xs font-bold hover:bg-white hover:text-terracotta transition-colors shadow-lg"
            >
              <Phone size={13} /> 
              <span className="inline">Contact</span>
            </Link>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors pointer-events-auto"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </nav>
      </div>

      {/* MOBILE NAVIGATION DRAWER OVERLAY (< 768px) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-obsidian/95 backdrop-blur-2xl z-40 md:hidden flex flex-col justify-center px-6 py-20 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col space-y-4 max-w-sm mx-auto w-full">
            <span className="text-xs font-mono uppercase tracking-widest text-terracotta mb-2 font-bold">
              Navigation Menu
            </span>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-terracotta text-white shadow-xl border border-terracotta/50'
                      : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-terracotta'} />
                  <span>{link.name === 'Eng' ? 'Engineering & Craft' : link.name}</span>
                </Link>
              );
            })}

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-obsidian font-black uppercase tracking-widest text-sm hover:bg-terracotta hover:text-white transition-colors shadow-2xl mt-4"
            >
              <Phone size={18} /> Contact Team
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
