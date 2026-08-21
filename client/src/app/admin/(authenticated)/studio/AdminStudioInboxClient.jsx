"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Search, Filter, Loader2 } from "lucide-react";
import axios from "axios";

export default function AdminStudioInboxClient() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE}/api/studio/designs`);
        setDesigns(response.data);
      } catch (err) {
        console.error("Failed to fetch designs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const filteredDesigns = designs.filter(d => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.clientInfo?.name?.toLowerCase().includes(term) ||
      d.clientInfo?.email?.toLowerCase().includes(term) ||
      d.baseVehicle?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-terracotta" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search submissions by client or vehicle..." 
            className="w-full bg-[#0B0C10]/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
        <button className="px-4 py-2.5 bg-white/5 border border-slate-700/50 rounded-xl text-slate-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Mobile Card List (< 768px) */}
      <div className="block md:hidden divide-y divide-white/5">
        {filteredDesigns.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No studio designs submitted yet.
          </div>
        ) : (
          filteredDesigns.map(design => (
            <div key={design._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{design.clientInfo.name}</h3>
                  <p className="text-xs text-slate-400">{design.clientInfo.email}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{design.clientInfo.phone}</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  {design.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
                <span className="capitalize text-sky-400 font-semibold">{design.baseVehicle.replace('-', ' ')}</span>
                <span className="text-[10px] text-slate-500">{new Date(design.createdAt).toLocaleDateString()}</span>
                <Link 
                  href={`/admin/studio/${design._id}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-xs"
                >
                  <Eye size={14} />
                  View 3D
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Client Info</th>
              <th className="px-6 py-4">Base Vehicle</th>
              <th className="px-6 py-4">Date Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">View Design</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
            {filteredDesigns.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  No studio designs submitted yet.
                </td>
              </tr>
            ) : (
              filteredDesigns.map(design => (
                <tr key={design._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{design.clientInfo.name}</span>
                      <span className="text-xs text-slate-400">{design.clientInfo.email}</span>
                      <span className="text-[10px] text-slate-500">{design.clientInfo.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize font-semibold text-sky-400">{design.baseVehicle.replace('-', ' ')}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(design.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      {design.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/studio/${design._id}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-sky-400 hover:bg-sky-500/10 transition-colors"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
