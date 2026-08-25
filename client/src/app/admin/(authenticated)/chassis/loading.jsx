export default function AdminChassisLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 bg-white/5 rounded-md w-64 mb-4"></div>
          <div className="h-4 bg-white/5 rounded-md w-96"></div>
        </div>
        <div className="h-10 w-32 bg-sky-500/10 border border-sky-500/20 rounded-lg"></div>
      </div>

      {/* Filter Tabs Placeholder */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <div className="h-9 w-28 bg-white/5 rounded-lg"></div>
        <div className="h-9 w-32 bg-white/5 rounded-lg"></div>
        <div className="h-9 w-32 bg-white/5 rounded-lg"></div>
      </div>

      {/* Split View Layout */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[100dvh] lg:h-[calc(100vh-16rem)] pb-12 lg:pb-0">
        
        {/* Left Side: Chassis List Placeholder */}
        <div className="lg:flex-1 bg-[#111216] border border-white/10 rounded-2xl flex flex-col overflow-hidden shrink-0">
          <div className="h-12 border-b border-white/5 bg-white/5 shrink-0"></div>
          
          <div className="flex-1 divide-y divide-white/5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-4 p-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-white/10 shrink-0"></div>
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-4 bg-white/10 rounded w-16 ml-auto"></div>
                <div className="h-4 bg-white/10 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Sticky Preview Panel Placeholder */}
        <div className="w-full lg:w-[400px] shrink-0 bg-[#181A1D] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          {/* 3D Canvas Area */}
          <div className="h-[300px] bg-[#0B0C10] relative shrink-0 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-white/10 border-t-sky-500 rounded-full animate-spin opacity-30"></div>
          </div>
          
          {/* Component Details */}
          <div className="p-6 flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-6 bg-white/10 rounded w-48"></div>
                <div className="h-5 w-16 bg-emerald-500/10 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-8 bg-white/10 rounded-lg"></div>
                <div className="w-16 h-8 bg-white/10 rounded-lg"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-white/5 rounded-xl border border-white/10"></div>
              <div className="h-16 bg-white/5 rounded-xl border border-white/10"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
