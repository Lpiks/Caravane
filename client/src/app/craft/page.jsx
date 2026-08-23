import Navbar from "@/components/ui/Navbar";
import XRaySlider from "@/components/craft/XRaySlider";
import { Thermometer, Zap, Hammer, ShieldCheck, Wrench, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CraftPage() {
  const specs = [
    {
      icon: Thermometer,
      title: "Climate Control",
      desc: "Closed-cell Armaflex paired with dense Rockwool batts creates an impenetrable thermal barrier. Engineered to keep interiors cool in the Sahara and warm in the Atlas mountains."
    },
    {
      icon: Zap,
      title: "Off-Grid Power",
      desc: "Architected around Victron Energy components. Lithium-ion battery banks, pure sine wave inverters, and marine-grade circuitry hidden perfectly within the framing."
    },
    {
      icon: Hammer,
      title: "Precision Joinery",
      desc: "No squeaks, no rattles. Our cabinetry is CNC-machined from marine-grade plywood and joined using aerospace-grade adhesives and structural aluminum profiles."
    }
  ];

  const steps = [
    { title: "Bare Metal Prep", desc: "Every chassis is stripped down to the bare metal. We apply advanced rust prevention coatings and acoustic deadening mats to ensure a silent ride.", icon: ShieldCheck },
    { title: "Thermal Armor", desc: "Layers of closed-cell Armaflex and dense Rockwool are painstakingly fitted into every cavity, creating a perfect thermal and acoustic barrier.", icon: Thermometer },
    { title: "The Nervous System", desc: "We map and install the entire 12V/220V electrical harness using marine-grade tinned copper wire and Victron Energy conduits.", icon: Zap },
    { title: "Custom Joinery", desc: "The CNC-machined marine plywood cabinetry is brought in and locked into the aluminum sub-frame using aerospace adhesives.", icon: Wrench }
  ];

  return (
    <div className="min-h-screen bg-obsidian text-linen overflow-x-hidden relative">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-sand/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <header className="relative w-full max-w-5xl mx-auto px-6 pt-24 pb-12 text-center z-10">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest bg-gradient-to-br from-linen via-sand to-terracotta bg-clip-text text-transparent mb-6 drop-shadow-sm">
          Engineering & <br className="md:hidden" />Craftsmanship
        </h1>
        <p className="text-lg md:text-xl text-sand/70 font-medium max-w-2xl mx-auto leading-relaxed">
          The true luxury of a Kouini Caravane lies beneath the surface. 
          Slide to inspect the foundational engineering that powers your off-grid autonomy.
        </p>
      </header>

      {/* Interactive Slider */}
      <section className="relative z-10 mt-4 mb-24">
        <XRaySlider />
      </section>

      {/* Build Process Timeline */}
      <section className="relative w-full max-w-5xl mx-auto px-6 py-24 z-10 border-t border-linen/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-sand mb-4">The Build Process</h2>
          <p className="text-linen/50 max-w-xl mx-auto">From bare metal to luxury habitat. Every step is meticulously engineered.</p>
        </div>
        
        <div className="relative border-l-2 border-terracotta/30 ml-4 md:ml-8 space-y-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative pl-8 md:pl-12">
                <div className="absolute left-[-17px] top-0 w-8 h-8 bg-obsidian border-2 border-terracotta rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(224,122,95,0.4)]">
                  <Icon size={14} className="text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-linen uppercase tracking-wider mb-2">{step.title}</h3>
                  <p className="text-sand/60 text-base md:text-lg">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Spec Grid */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-24 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div key={i} className="bg-linen/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(224,122,95,0.15)] hover:border-terracotta/40 transition-all duration-500 group">
                <div className="w-14 h-14 bg-terracotta/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-terracotta transition-colors duration-500 shadow-inner">
                  <Icon size={28} className="text-terracotta group-hover:text-obsidian transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider text-sand mb-3">
                  {spec.title}
                </h3>
                <p className="text-sm font-medium text-sand/60 leading-relaxed group-hover:text-sand/90 transition-colors">
                  {spec.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative w-full py-32 mt-12 border-t border-linen/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian to-[#2a1b18] z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center z-0 mix-blend-overlay" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-linen mb-6">
            Ready to engineer your escape?
          </h2>
          <p className="text-sand/70 text-lg mb-10">
            Step into the Studio and configure your custom Kouini Caravane from the chassis up.
          </p>
          <Link href="/studio">
            <button className="px-10 py-4 bg-terracotta text-linen font-bold uppercase tracking-widest rounded-lg hover:bg-linen hover:text-obsidian transition-all duration-300 shadow-[0_0_20px_rgba(224,122,95,0.4)] hover:shadow-[0_0_30px_rgba(235,213,193,0.6)] hover:-translate-y-1">
              Start Your Build
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
