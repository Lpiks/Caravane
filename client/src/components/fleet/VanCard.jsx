"use client";
import { motion } from "framer-motion";
import { Sun, Droplets, Moon, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VanCard({ vehicle }) {
  const isRental = vehicle.type === 'rental';
  // Use a fallback image if undefined or empty array
  const imageSrc = Array.isArray(vehicle.images) && vehicle.images.length > 0 
    ? vehicle.images[0] 
    : (vehicle.image || '/placeholder-van.jpg');

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      // Handled by staggered parent container in page.jsx, but let's keep whileHover here
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col h-full hover:border-terracotta/50 hover:shadow-[0_0_40px_rgba(200,90,50,0.15)] transition-all duration-500"
    >
      {/* Vehicle Image & Badges */}
      <div className="relative w-full aspect-video overflow-hidden">
        {/* Dark gradient overlay at the bottom of the image for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181A1D] via-transparent to-transparent z-10 opacity-60"></div>
        
        <img 
          src={imageSrc} 
          alt={vehicle.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Top-Left Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          {isRental ? (
            <div className="bg-sky-500/10 text-sky-300 border border-sky-500/30 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              EXPEDITION RENT
            </div>
          ) : (
            <div className="bg-terracotta/10 text-terracotta border border-terracotta/30 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_15px_rgba(200,90,50,0.3)]">
              FOR SALE
            </div>
          )}
        </div>

        {/* Top-Right Price Tag */}
        <div className="absolute top-4 right-4 z-20 bg-obsidian/80 backdrop-blur-md text-linen font-bold px-4 py-1.5 rounded-full text-sm border border-white/10 shadow-lg">
          {vehicle.price}
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-6 flex flex-col flex-1 relative z-20 bg-gradient-to-b from-transparent to-obsidian/40">
        <h3 className="text-2xl font-black text-linen tracking-wide group-hover:text-terracotta transition-colors duration-300">{vehicle.title}</h3>
        <p className="text-xs text-linen/50 uppercase tracking-[0.2em] mt-1 font-mono">{vehicle.chassis}</p>
        
        {/* Premium Sleek Specs Bar */}
        <div className="flex justify-between items-center mt-6 mb-8 py-3 border-y border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-oasis/40 group-hover:bg-oasis/10 transition-colors">
              <Sun size={14} className="text-oasis group-hover:animate-pulse" />
            </div>
            <span className="text-xs font-bold text-linen/70 uppercase tracking-widest">{vehicle.specs?.solarWatts}W</span>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-sky-400/40 group-hover:bg-sky-400/10 transition-colors">
              <Droplets size={14} className="text-sky-400 group-hover:animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            <span className="text-xs font-bold text-linen/70 uppercase tracking-widest">{vehicle.specs?.waterLiters}L</span>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-linen/40 group-hover:bg-linen/10 transition-colors">
              <Moon size={14} className="text-linen/70" />
            </div>
            <span className="text-xs font-bold text-linen/70 uppercase tracking-widest">{vehicle.specs?.sleeps} <span className="text-[10px]">Berths</span></span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="mt-auto">
          <Link 
            href={`/contact?vehicle=${vehicle._id}`}
            className="w-full relative overflow-hidden bg-white/5 text-linen py-3.5 rounded-xl flex items-center justify-center gap-2 border border-white/10 font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 group/btn"
          >
            <div className="absolute inset-0 bg-terracotta translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center gap-2">
              Inquire Now <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
