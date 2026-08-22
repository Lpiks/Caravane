"use client";
import Navbar from "@/components/ui/Navbar";
import GarageShowroom from "@/components/3d/GarageShowroom";

export default function GarageClient() {
  return (
    <div className="bg-[#0a0a0c] min-h-screen text-linen w-full h-screen relative overflow-hidden">
      <Navbar />
      <div className="w-full h-full">
        <GarageShowroom />
      </div>
    </div>
  );
}
