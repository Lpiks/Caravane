export default function StudioLoadingSkeleton() {
  return (
    <div className="w-full min-h-[100dvh] h-screen bg-linen flex flex-col overflow-hidden relative animate-pulse">

      {/* Top Header Placeholder */}
      <div className="w-full bg-obsidian py-2.5 sm:py-4 px-3 sm:px-8 flex items-center justify-between border-b border-sand/20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-white/10 rounded"></div>
          <div className="hidden sm:block h-8 w-40 bg-white/5 rounded"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 bg-white/5 rounded"></div>
          <div className="h-8 w-32 bg-white/5 rounded"></div>
        </div>
      </div>

      {/* Main Studio Workspace Placeholder */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left: Components Catalog Sidebar Placeholder */}
        <div className="hidden lg:flex w-64 bg-obsidian border-r border-white/10 flex-col p-4">
          <div className="h-10 w-full bg-white/5 rounded-xl mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="h-24 w-full bg-white/5 rounded-2xl border border-white/10"></div>
            ))}
          </div>
        </div>

        {/* Center: 3D Canvas Placeholder */}
        <div className="flex-1 bg-linen flex items-center justify-center relative">
          <div className="flex flex-col items-center gap-6 opacity-40">
            <div className="w-16 h-16 border-2 border-obsidian/10 border-t-terracotta rounded-full animate-spin"></div>
            <div className="h-4 w-48 bg-terracotta/20 rounded-md"></div>
          </div>
        </div>

        {/* Right: Build Specs Dashboard Placeholder */}
        <div className="hidden lg:flex w-96 bg-obsidian p-6 border-l border-white/10 flex-col">
          <div className="h-6 w-32 bg-white/10 rounded mb-6"></div>
          <div className="space-y-6">
            <div className="h-40 w-full bg-white/5 rounded-2xl"></div>
            <div className="h-32 w-full bg-white/5 rounded-2xl"></div>
            <div className="h-12 w-full bg-terracotta/20 rounded-xl mt-8"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
