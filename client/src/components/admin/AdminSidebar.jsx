'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  CarFront, 
  Cuboid, 
  MessageSquare, 
  Settings, 
  LogOut,
  Wrench,
  BookOpen,
  LayoutTemplate,
  X
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    router.push('/admin/login');
  };

  const navLinks = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Fleet Inventory', href: '/admin/fleet', icon: CarFront },
    { name: 'Chassis Inventory', href: '/admin/chassis', icon: CarFront },
    { name: 'Chassis Builder', href: '/admin/chassis/builder', icon: Wrench },
    { name: 'Studio Designs', href: '/admin/studio', icon: Cuboid },
    { name: 'Layout Templates', href: '/admin/templates', icon: LayoutTemplate },
    { name: 'Customer Inquiries', href: '/admin/messages', icon: MessageSquare },
    { name: '3D Components', href: '/admin/components', icon: Settings },
    { name: 'Compound Builder', href: '/admin/components/builder', icon: Wrench },
    { name: 'Platform Documentation', href: '/admin/docs', icon: BookOpen },
  ];

  const adminName = admin?.name || 'Admin User';
  const adminEmail = admin?.email || 'admin@kouinicaravane.dz';
  const initials = adminName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Wrapper (Desktop Fixed + Mobile Slide-out Drawer) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:static h-screen py-4 pl-4 shrink-0 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <aside className="w-64 flex-1 bg-obsidian/90 md:bg-obsidian/60 backdrop-blur-2xl border border-white/10 flex flex-col relative z-20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden">
          {/* Brand Header */}
          <div className="p-6 pb-2 pt-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Kouini <span className="text-sky-400">Caravane</span>
              </h1>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-sky-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                v1.0 SaaS
              </div>
            </div>
            {/* Close Button for Mobile Drawer */}
            <button
              onClick={onClose}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto glass-scrollbar">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = 
                (link.href === '/admin' || link.href === '/admin/components' || link.href === '/admin/chassis')
                  ? pathname === link.href
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => { if (onClose) onClose(); }}
                  className={`group flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-2xl transition-all duration-300 relative ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold shadow-inner border border-white/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`transition-colors duration-300 ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-400/70'}`} 
                  />
                  <span className="text-sm tracking-wide">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Area */}
          <div className="p-4 mt-auto mb-2">
            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-3 sm:p-4 flex flex-col gap-3 backdrop-blur-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{adminName}</div>
                  <div className="text-[10px] text-sky-400 truncate" title={adminEmail}>{adminEmail}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 cursor-pointer"
              >
                <LogOut size={14} />
                Secure Logout
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
