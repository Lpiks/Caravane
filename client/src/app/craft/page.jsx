import Navbar from "@/components/ui/Navbar";
import XRaySlider from "@/components/craft/XRaySlider";
import { Thermometer, Zap, Hammer } from "lucide-react";

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
      desc: "Architected around Victron Energy components. Lithium-ion battery banks, pure sine wave inverters, and marine-grade 12V/220V circuitry hidden perfectly within the chassis framing."
    },
    {
      icon: Hammer,
      title: "Precision Joinery",
      desc: "No squeaks, no rattles. Our cabinetry is CNC-machined from marine-grade plywood and joined using aerospace-grade adhesives and structural aluminum corner profiles."
    }
  ];

  return (
    <div className="min-h-screen bg-obsidian text-linen pb-16 overflow-x-hidden">
      {/* Hero Section */}
      <header className="w-full max-w-5xl mx-auto px-6 pt-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-widest text-sand mb-6 drop-shadow-sm">
          Engineering & <br className="md:hidden" />Craftsmanship
        </h1>
        <p className="text-lg md:text-xl text-sand/70 font-medium max-w-2xl mx-auto leading-relaxed">
          The true luxury of a Kouini Caravane lies beneath the surface. 
          Slide to inspect the foundational engineering that powers your off-grid autonomy.
        </p>
      </header>

      {/* Interactive Slider */}
      <section className="mt-8">
        <XRaySlider />
      </section>

      {/* Spec Grid */}
      <section className="w-full max-w-6xl mx-auto px-6 mt-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div key={i} className="bg-linen/5 border border-sand/10 rounded-xl p-8 hover:bg-linen/10 hover:border-terracotta/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-terracotta/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-terracotta transition-colors">
                  <Icon size={28} className="text-terracotta group-hover:text-linen transition-colors" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wider text-sand mb-3">
                  {spec.title}
                </h3>
                <p className="text-sm font-medium text-sand/60 leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
