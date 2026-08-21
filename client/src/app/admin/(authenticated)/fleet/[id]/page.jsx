import Link from 'next/link';
import { ArrowLeft, Save, UploadCloud, Plus } from 'lucide-react';

export const metadata = {
  title: 'Edit Vehicle | Kouini Caravane Admin',
};

export default function AdminFleetEditorPage({ params }) {
  // In a real app, you would fetch the vehicle data using params.id
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/fleet"
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Vehicle Unit</h1>
            <p className="text-sm text-slate-400">ID: {params.id || 'New'}</p>
          </div>
        </div>
        
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
        <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Vehicle Name</label>
            <input 
              type="text" 
              defaultValue="Mercedes Sprinter 4x4"
              className="w-full bg-[#0B0C10]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Price (DZD)</label>
            <input 
              type="number" 
              defaultValue="12500000"
              className="w-full bg-[#0B0C10]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <textarea 
            rows="4"
            className="w-full bg-[#0B0C10]/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            defaultValue="Premium off-grid camper van ready for your next adventure."
          ></textarea>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">Media Gallery</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <UploadCloud size={16} />
            Upload Images
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Image Placeholders */}
          <div className="aspect-video bg-slate-800 rounded-lg border border-dashed border-slate-600 flex items-center justify-center text-slate-500">
            Main Image
          </div>
          <div className="aspect-video bg-slate-800/50 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-600">
            Gallery 1
          </div>
          <div className="aspect-video bg-slate-800/50 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-600">
            Gallery 2
          </div>
          <div className="aspect-video bg-slate-800/50 rounded-lg border border-dashed border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer flex flex-col items-center justify-center text-slate-500 gap-2">
            <Plus size={20} />
            <span className="text-xs">Add More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
