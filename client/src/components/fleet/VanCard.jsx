"use client";
import { motion } from "framer-motion";
import { Sun, Droplets, Moon, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VanCard({ vehicle }) {
  const isRental = vehicle.type === 'rental';

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-[#1E2024] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col h-full"
    >
      {/* Vehicle Image & Badges */}
      <div className="relative w-full aspect-video">
        <img 
          src={vehicle.image} 
          alt={vehicle.title}
          className="w-full h-full object-cover"
        />
        
        {/* Top-Left Category Badge */}
        <div className="absolute top-4 left-4">
          {isRental ? (
            <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest backdrop-blur-md">
              EXPEDITION RENT
            </div>
          ) : (
            <div className="bg-[#C85A32]/20 text-[#C85A32] border border-[#C85A32]/30 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest backdrop-blur-md">
              FOR SALE
            </div>
          )}
        </div>

        {/* Top-Right Price Tag */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white font-bold px-3 py-1 rounded-full text-sm">
          {vehicle.price}
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white tracking-wide">{vehicle.title}</h3>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{vehicle.chassis}</p>
        
        {/* Off-Grid Specs Bar */}
        <div className="grid grid-cols-3 gap-2 mt-6 mb-8">
          <div className="bg-white/5 rounded-lg p-3 flex flex-col items-center justify-center border border-white/5">
            <Sun size={16} className="text-oasis mb-1" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider whitespace-nowrap">{vehicle.specs?.solarWatts}W</span>
          </div>
          <div className="bg-white/5 rounded-lg p-3 flex flex-col items-center justify-center border border-white/5">
            <Droplets size={16} className="text-blue-400 mb-1" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider whitespace-nowrap">{vehicle.specs?.waterLiters}L</span>
          </div>
          <div className="bg-white/5 rounded-lg p-3 flex flex-col items-center justify-center border border-white/5">
            <Moon size={16} className="text-linen/70 mb-1" />
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider whitespace-nowrap">{vehicle.specs?.sleeps} Berths</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="mt-auto">
          <Link 
            href={`/contact?vehicle=${vehicle._id}`}
            className="w-full bg-white/5 hover:bg-terracotta text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 font-bold text-sm tracking-wider uppercase group"
          >
            Inquire Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
