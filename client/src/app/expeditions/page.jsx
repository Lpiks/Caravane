import ParallaxRoadTrip from "@/components/expeditions/ParallaxRoadTrip";
import InteractiveMap from "@/components/expeditions/InteractiveMap";

export default function ExpeditionsPage() {
  return (
    <div className="bg-obsidian text-linen min-h-screen">
      <InteractiveMap />
      <ParallaxRoadTrip />
    </div>
  );
}
