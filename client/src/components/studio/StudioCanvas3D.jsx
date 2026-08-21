"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import useStudioStore from "@/store/useStudioStore";
import VanShell3D from "./VanShell3D";
import ModuleMesh3D from "./ModuleMesh3D";
import LayerToggleBar from "./LayerToggleBar";
import ActiveModulePanel from "./ActiveModulePanel";
import * as THREE from "three";

export default function StudioCanvas3D() {
  const { placedModules } = useStudioStore();
  const controlsRef = useRef(null);

  const setCameraPreset = (preset) => {
    if (!controlsRef.current) return;
    switch (preset) {
      case 'iso':
        controlsRef.current.object.position.set(4, 4, 4);
        break;
      case 'top':
        controlsRef.current.object.position.set(0, 8, 0);
        break;
      case 'side':
        controlsRef.current.object.position.set(6, 1, 0);
        break;
    }
    controlsRef.current.target.set(0, 1, 0);
    controlsRef.current.update();
  };

  return (
    <div 
      className="relative w-full h-full min-h-[350px] bg-[#181A1D] overflow-hidden flex-1 touch-none"
      style={{ touchAction: 'none' }}
    >
      <LayerToggleBar />
      <ActiveModulePanel />

      {/* Grid Scale Legend */}
      <div className="absolute bottom-14 left-4 z-10 px-2.5 py-1 bg-[#181A1D]/80 backdrop-blur-sm border border-white/10 rounded text-[10px] text-sand uppercase font-bold tracking-wider select-none hidden sm:flex items-center gap-2">
        <div className="w-2.5 h-2.5 border border-[#E07A5F]/70 bg-[#E07A5F]/15 rounded flex items-center justify-center">
          <div className="w-1 h-1 bg-[#E07A5F] rounded-xs" />
        </div>
        <span>Grid Square = 50 × 50 cm</span>
      </div>

      {/* Camera Presets */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1.5 sm:gap-2 max-w-[calc(100%-80px)]">
        <button onClick={() => setCameraPreset('iso')} className="bg-white/10 hover:bg-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sand px-2.5 sm:px-3 py-1.5 rounded backdrop-blur-sm border border-white/10 transition-colors">Iso</button>
        <button onClick={() => setCameraPreset('top')} className="bg-white/10 hover:bg-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sand px-2.5 sm:px-3 py-1.5 rounded backdrop-blur-sm border border-white/10 transition-colors">Top</button>
        <button onClick={() => setCameraPreset('side')} className="bg-white/10 hover:bg-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sand px-2.5 sm:px-3 py-1.5 rounded backdrop-blur-sm border border-white/10 transition-colors">Side</button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest font-mono text-right hidden md:flex flex-col gap-1">
        <span>Tap item to select</span>
        <span>Press 'R' to rotate 90°</span>
      </div>

      <Canvas
        camera={{ position: [7, 5, 8], fov: 50 }}
        onPointerMissed={() => useStudioStore.getState().setActiveModule(null)}
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} />
        <directionalLight position={[-5, 4, -5]} intensity={1.0} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={2}
          maxDistance={40}
          target={[0, 0.8, 0]}
          rotateSpeed={0.8}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />

        <VanShell3D />

        {placedModules.map((mod) => (
          <ModuleMesh3D key={mod.id} mod={mod} />
        ))}
      </Canvas>
    </div>
  );
}
