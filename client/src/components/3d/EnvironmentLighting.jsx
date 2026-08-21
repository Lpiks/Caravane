"use client";
import SafeEnvironment from "./SafeEnvironment";
import useVehicleStore from "@/store/useVehicleStore";

export default function EnvironmentLighting() {
  const ambientEnvironment = useVehicleStore((state) => state.ambientEnvironment);

  return (
    <>
      {ambientEnvironment === 'sahara-sunset' && (
        <>
          <SafeEnvironment preset="sunset" background={false} />
          <ambientLight intensity={0.5} color="#ffd8a8" />
          <directionalLight 
            castShadow 
            position={[5, 5, 5]} 
            intensity={1.5} 
            color="#ff9248" // Warm terracotta/golden
            shadow-mapSize={[1024, 1024]}
          />
        </>
      )}

      {ambientEnvironment === 'mediterranean-day' && (
        <>
          <SafeEnvironment preset="city" background={false} />
          <ambientLight intensity={0.8} color="#ffffff" />
          <directionalLight 
            castShadow 
            position={[10, 10, 5]} 
            intensity={2.0} 
            color="#e0f2fe" // Crisp daylight
            shadow-mapSize={[2048, 2048]}
          />
        </>
      )}

      {ambientEnvironment === 'campfire-night' && (
        <>
          <SafeEnvironment preset="night" background={false} />
          <ambientLight intensity={0.2} color="#1e1b4b" /> {/* Deep navy */}
          
          {/* Moonlight */}
          <directionalLight 
            position={[-5, 5, -5]} 
            intensity={0.5} 
            color="#818cf8"
          />
          
          {/* Campfire glow near the chassis */}
          <pointLight 
            position={[3, 1, 3]} 
            intensity={2.5} 
            color="#f97316" // Warm orange
            distance={10}
            decay={2}
            castShadow
          />
        </>
      )}
    </>
  );
}
