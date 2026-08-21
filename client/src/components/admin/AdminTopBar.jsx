import Link from 'next/link';
import { ExternalLink, CalendarDays, Menu } from 'lucide-react';

export default function AdminTopBar({ onToggleMobileSidebar }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 border-b border-slate-800/50 bg-[#0B0C10]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-3 text-slate-300 text-sm">
        {/* Mobile Drawer Trigger Button */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <span className="font-semibold text-slate-100 tracking-tight text-sm sm:text-base">
          Admin Dashboard
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
          <CalendarDays size={16} />
          <span>{currentDate}</span>
        </div>
        
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/10 px-2.5 sm:px-3 py-1.5 rounded-full border border-sky-500/20"
        >
          <span>View Site</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </header>
  );
}
