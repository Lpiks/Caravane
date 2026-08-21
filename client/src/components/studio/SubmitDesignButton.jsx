"use client";
import { useState } from "react";
import useStudioStore from "@/store/useStudioStore";
import { Send, X, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";

export default function SubmitDesignButton() {
  const { activeChassis, activeModelId, placedModules } = useStudioStore();
  
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const payload = {
        clientInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        baseVehicle: activeChassis,
        configurationData: { 
          placedModules,
          activeModelId,
          activeChassis
        },
        message: formData.message
      };

      await axios.post(`${API_BASE}/api/studio/save`, payload);
      setStatus("success");
    } catch (error) {
      console.error("Failed to submit design:", error);
      setStatus("error");
    }
  };

  return (
    <>
      <button 
        onClick={() => { setStatus("idle"); setShowModal(true); }}
        className="w-full mt-6 py-4 px-6 bg-terracotta text-white font-bold uppercase tracking-widest flex items-center justify-center gap-3 rounded-md hover:bg-white hover:text-obsidian transition-colors shadow-lg"
      >
        <Send size={18} />
        Submit Build for Quote
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
              <div>
                <h3 className="text-xl font-bold text-white">Submit Your Design</h3>
                <p className="text-sm text-slate-400 mt-1">Send your 3D layout to our team for a professional review and quote.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Design Sent Successfully!</h4>
                  <p className="text-slate-400 max-w-sm">Our engineering team has received your 3D layout. We will contact you shortly to discuss your build.</p>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-terracotta transition-colors"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-terracotta transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-terracotta transition-colors"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Additional Notes</label>
                    <textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#0B0C10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-terracotta transition-colors min-h-[100px] resize-y"
                      placeholder="Any specific requirements or questions about your build?"
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
                      There was a problem sending your design. Please try again.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === "loading" || placedModules.length === 0}
                    className="w-full mt-4 py-4 px-6 bg-terracotta text-white font-bold uppercase tracking-widest flex items-center justify-center gap-3 rounded-lg hover:bg-white hover:text-obsidian transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={18} /> Submit Design</>
                    )}
                  </button>
                  
                  {placedModules.length === 0 && (
                    <p className="text-xs text-center text-rose-400 mt-2">
                      Please add at least one module to your van before submitting.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
