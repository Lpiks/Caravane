"use client";
import useStudioStore from "@/store/useStudioStore";
import { generateWhatsAppUrl } from "@/lib/whatsappFormatter";
import { Send } from "lucide-react";

export default function WhatsAppInquireButton() {
  const { activeChassis, placedModules, getTotals } = useStudioStore();

  const handleInquire = () => {
    const url = generateWhatsAppUrl(activeChassis, placedModules, getTotals());
    window.open(url, '_blank');
  };

  return (
    <button 
      onClick={handleInquire}
      className="w-full mt-6 py-4 px-6 bg-terracotta text-white font-bold uppercase tracking-widest flex items-center justify-center gap-3 rounded-md hover:bg-white hover:text-obsidian transition-colors shadow-lg"
    >
      <Send size={18} />
      Inquire Build via WhatsApp
    </button>
  );
}
