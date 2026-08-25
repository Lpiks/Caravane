export default function GarageLoadingSkeleton() {
  return (
    <div className="bg-[#0a0a0c] min-h-screen w-full flex flex-col overflow-hidden animate-pulse">
      {/* Navbar Placeholder */}
      <div className="h-24 w-full bg-black/20 border-b border-white/5 shrink-0"></div>
      
      {/* Main 3D Canvas Area Placeholder */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        {/* Subtle grid/radial gradient to mimic the showroom floor initializing */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] via-[#0a0a0c] to-[#0a0a0c]"></div>
        
        {/* Center Loading Indicator */}
        <div className="relative z-10 flex flex-col items-center gap-6 opacity-30">
           <div className="w-16 h-16 border-2 border-white/10 border-t-sky-500 rounded-full animate-spin"></div>
           <div className="h-4 w-48 bg-sky-500/20 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
