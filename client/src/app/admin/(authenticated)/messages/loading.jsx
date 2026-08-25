export default function AdminMessagesLoadingSkeleton() {
  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)] animate-pulse">
      {/* Header Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="h-8 bg-white/5 rounded-md w-64 mb-4"></div>
          <div className="h-4 bg-white/5 rounded-md w-96"></div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Messages List Sidebar Placeholder */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-[#0B0C10]/30 shrink-0">
          <div className="p-4 border-b border-white/10">
            <div className="h-9 w-full bg-white/10 rounded-lg"></div>
          </div>
          
          <div className="flex-1 overflow-y-hidden divide-y divide-white/5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 border-l-2 border-transparent">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-3 bg-white/10 rounded w-12"></div>
                </div>
                <div className="h-3 bg-white/10 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Message View Area Placeholder */}
        <div className="flex-1 flex flex-col bg-[#0B0C10]/10">
          {/* Action Bar */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="space-y-3">
              <div className="h-6 bg-white/10 rounded w-64"></div>
              <div className="flex gap-4">
                 <div className="h-3 bg-white/10 rounded w-32"></div>
                 <div className="h-3 bg-white/10 rounded w-32"></div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0"></div>
          </div>
          
          {/* Email Body */}
          <div className="p-6 flex-1 flex flex-col gap-6">
            <div className="h-16 w-32 bg-sky-500/10 border border-sky-500/20 rounded-xl"></div>
            
            <div className="bg-[#0B0C10]/50 border border-white/5 rounded-xl p-5 shadow-inner flex-1 space-y-4">
              <div className="h-4 bg-white/10 rounded w-32 mb-8"></div>
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-3 bg-white/10 rounded w-[90%]"></div>
              <div className="h-3 bg-white/10 rounded w-[95%]"></div>
              <div className="h-3 bg-white/10 rounded w-[80%]"></div>
            </div>
          </div>
          
          {/* Reply Button Footer */}
          <div className="p-6 border-t border-white/10 shrink-0 bg-black/20">
            <div className="w-48 h-10 rounded-lg bg-blue-600/30"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
