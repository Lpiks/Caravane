import { Mail, Search, CheckCircle, Trash2 } from 'lucide-react';

export const metadata = {
  title: 'Customer Inquiries | Kouini Caravane Admin',
};

export default function AdminMessagesPage() {
  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customer Inquiries</h1>
          <p className="text-slate-400">Manage standard contact form submissions.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Messages List Sidebar */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-[#0B0C10]/30 shrink-0">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-[#0B0C10]/50 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {/* Active Message Item */}
            <div className="p-4 border-l-2 border-blue-500 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-white text-sm">Karim S.</span>
                <span className="text-xs text-slate-500">2h ago</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-1 truncate">Question about custom modifications</p>
              <p className="text-xs text-slate-500 truncate">Hello, I have an old van and I was wondering...</p>
            </div>

            {/* Inactive Message Item */}
            <div className="p-4 border-l-2 border-transparent cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-300 text-sm">Youssef B.</span>
                <span className="text-xs text-slate-500">Yesterday</span>
              </div>
              <p className="text-xs text-slate-400 truncate mb-1">Price quote for Sprinter</p>
              <p className="text-xs text-slate-500 truncate">Can you give me an estimate for...</p>
            </div>
          </div>
        </div>

        {/* Message View Area */}
        <div className="flex-1 flex flex-col bg-[#0B0C10]/10">
          <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Question about custom modifications</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-300">From: <a href="mailto:karim@example.dz" className="text-blue-400 hover:underline">karim@example.dz</a></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500">Oct 14, 2026 at 15:30</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors tooltip-target" title="Mark as Resolved">
                <CheckCircle size={18} />
              </button>
              <button className="p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors tooltip-target" title="Delete Message">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 text-slate-300 leading-relaxed text-sm">
            <p>Hello Kouini Caravane team,</p>
            <br />
            <p>I recently bought a 2018 Peugeot Boxer and I'm very interested in your outfitting services. 
            Do you handle custom modifications if I already have the van, or do you only sell fully finished vehicles?</p>
            <br />
            <p>I am looking for a setup similar to the one you posted on your Instagram last week, but with a larger water tank.</p>
            <br />
            <p>Thanks,<br />Karim</p>
          </div>
          
          <div className="p-6 border-t border-white/10 shrink-0">
            <a 
              href="mailto:karim@example.dz"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              <Mail size={18} />
              Reply via Email
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
