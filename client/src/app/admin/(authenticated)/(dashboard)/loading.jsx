export default function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* Header Placeholder */}
      <div>
        <div className="h-8 bg-white/5 rounded-md w-64 mb-4"></div>
        <div className="h-4 bg-white/5 rounded-md w-96"></div>
      </div>

      {/* KPI Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-36">
            <div className="h-4 bg-white/10 rounded w-24 mb-6"></div>
            <div className="h-10 bg-white/10 rounded w-16 mb-4"></div>
            <div className="h-3 bg-white/10 rounded w-32"></div>
          </div>
        ))}
      </div>

      {/* Charts & Actions Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Area */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="h-6 bg-white/10 rounded w-40 mb-8"></div>
          <div className="flex-1 w-full bg-white/5 rounded-xl"></div>
        </div>
        
        {/* Recent Actions Area */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col">
          <div className="h-6 bg-white/10 rounded w-40 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 shrink-0"></div>
                <div className="flex-1 pt-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
