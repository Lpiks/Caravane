export default function FleetLoadingSkeleton() {
  return (
    <div className="bg-obsidian min-h-screen text-linen font-sans overflow-x-hidden animate-pulse">
      {/* Navbar Placeholder */}
      <div className="h-24 w-full bg-black/20 border-b border-white/5"></div>

      <main className="w-full max-w-7xl mx-auto px-6 pt-32 pb-24 relative">
        {/* Hero Header Placeholder */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="h-16 md:h-20 bg-white/5 rounded-xl w-64 md:w-96 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded-md w-full max-w-2xl"></div>
              <div className="h-4 bg-white/5 rounded-md w-3/4 max-w-xl"></div>
            </div>
          </div>
        </div>

        {/* Tabs & Filter Placeholder */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
          <div className="h-14 bg-white/5 rounded-full w-full sm:w-96 border border-white/10"></div>
          <div className="h-12 bg-white/5 rounded-full w-full sm:w-40 border border-white/10"></div>
        </div>

        {/* Vehicle Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[450px] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col">
              <div className="h-48 bg-white/10 rounded-2xl w-full mb-6"></div>
              <div className="h-6 bg-white/10 rounded-md w-3/4 mb-4"></div>
              <div className="flex gap-2 mb-6">
                 <div className="h-6 bg-white/10 rounded-full w-16"></div>
                 <div className="h-6 bg-white/10 rounded-full w-20"></div>
              </div>
              <div className="mt-auto h-12 bg-white/10 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
