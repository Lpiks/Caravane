"use client";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the heavy client component to keep initial bundle size light
const GarageClient = dynamic(() => import("./GarageClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen bg-[#0a0a0c] flex items-center justify-center text-sky-500 font-mono tracking-widest uppercase text-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-sky-500" size={40} />
        <span>Loading Garage Showroom...</span>
      </div>
    </div>
  )
});

export default function GaragePage() {
  return <GarageClient />;
}
