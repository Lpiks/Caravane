'use client';

import Link from 'next/link';
import { Plus, Search, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

const vehicles = [
  {
    id: 1,
    name: 'Mercedes Sprinter 4x4',
    subtitle: '2.3L Diesel High-Roof',
    type: 'Camper Van',
    price: '12,500,000',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Renault Master L3H2',
    subtitle: 'Extended Chassis',
    type: 'Camper Van',
    price: '8,200,000',
    status: 'Rented',
    image: 'https://images.unsplash.com/photo-1566830646346-6084620f3a67?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Toyota Coaster',
    subtitle: 'Minibus Conversion',
    type: 'Rental Unit',
    price: '25,000 / Day',
    status: 'Sold',
    image: 'https://images.unsplash.com/photo-1601700676450-45c1dfd490b4?q=80&w=200&auto=format&fit=crop'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function FleetClient() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Fleet Inventory</h1>
          <p className="text-slate-400 text-sm">Manage all vehicles in the Kouini Caravane fleet.</p>
        </div>
        <Link 
          href="/admin/fleet/new" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors w-full sm:w-auto shadow-lg active:scale-95"
        >
          <Plus size={18} />
          <span>Add Vehicle</span>
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search fleet by name or type..." 
              className="w-full bg-[#0B0C10]/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Mobile View: Cards Layout (< 768px) */}
        <motion.div 
          className="block md:hidden divide-y divide-white/5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {vehicles.map((v) => (
            <motion.div 
              key={v.id} 
              variants={cardVariants}
              className="p-4 flex gap-4 items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={v.image} 
                  alt={v.name} 
                  className="w-16 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{v.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{v.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">{v.price} DZD</span>
                    <span className="text-white/20">•</span>
                    <span className="text-[10px] text-slate-400 font-medium capitalize">{v.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border
                  ${v.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                  ${v.status === 'Rented' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                  ${v.status === 'Sold' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}
                `}>
                  {v.status}
                </span>
                <Link 
                  href={`/admin/fleet/${v.id}`}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white rounded-lg text-slate-400 transition-colors"
                >
                  <Edit2 size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop View: Table Layout (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-white/10 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4 w-20">Image</th>
                <th className="px-6 py-4">Vehicle Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price (DZD)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              className="divide-y divide-white/5 text-slate-300 text-sm font-medium"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {vehicles.map((vehicle) => (
                <motion.tr 
                  key={vehicle.id}
                  variants={cardVariants}
                  className="hover:bg-[#181A1D] transition-colors duration-200 cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      className="aspect-video w-20 rounded-md object-cover border border-white/10"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{vehicle.name}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{vehicle.subtitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{vehicle.type}</td>
                  <td className="px-6 py-4 font-mono text-slate-200">{vehicle.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border
                      ${vehicle.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                      ${vehicle.status === 'Rented' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                      ${vehicle.status === 'Sold' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}
                    `}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/fleet/${vehicle.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 group-hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                    >
                      <Edit2 size={16} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
