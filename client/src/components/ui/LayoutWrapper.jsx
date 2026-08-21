'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import SlidingFooter from '@/components/ui/SlidingFooter';
import TravelPattern from '@/components/ui/TravelPattern';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <TravelPattern />}
      {!isAdmin && <Navbar />}
      {/* Main content wrapper with App Canvas aesthetic */}
      <main className={!isAdmin ? "pt-[76px] h-screen flex flex-col bg-transparent overflow-hidden" : "min-h-screen"}>
        <div className={!isAdmin ? "flex-1 w-full bg-obsidian rounded-t-[2.5rem] overflow-y-auto overflow-x-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative" : ""}>
          {children}
        </div>
      </main>
      {!isAdmin && <SlidingFooter />}
    </>
  );
}
