'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { Loader2 } from 'lucide-react';

export default function AdminAuthenticatedLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const verifySession = async () => {
      const isValid = await checkAuth();
      if (!isValid && isMounted) {
        router.push('/admin/login');
      } else if (isMounted) {
        setChecking(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, router]);

  // Lock body scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  if (checking) {
    return (
      <div className="min-h-[100dvh] h-screen w-full bg-[#090A0D] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="animate-spin text-sky-400" size={32} />
        <span className="text-xs uppercase tracking-widest font-mono text-slate-500">Verifying Security Token...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-[100dvh] h-screen overflow-hidden bg-[#090A0D] text-slate-100 font-sans relative">
      <AdminSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen py-2 md:py-4 pr-2 md:pr-4 pl-2 md:pl-4 z-10">
        <div className="flex-1 bg-[#111216] border border-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col relative shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <AdminTopBar 
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
          />
          <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto glass-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
