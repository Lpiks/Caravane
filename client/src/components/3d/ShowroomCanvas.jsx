"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import VehicleModel from "./VehicleModel";
import EnvironmentLighting from "./EnvironmentLighting";
import useVehicleStore from "@/store/useVehicleStore";

function CameraController({ preset, controlsRef, isMobile }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    controls.autoRotate = preset === 'iso';

    if (preset === 'top') {
      camera.position.set(0, isMobile ? 10 : 8, 0);
      controls.target.set(0, isMobile ? -0.8 : 1, 0);
    } else if (preset === 'inside') {
      camera.position.set(0, 1.6, 2.8);
      controls.target.set(0, 1.2, -2);
    } else if (preset === 'side') {
      camera.position.set(isMobile ? 7.5 : 6, 1.5, 0);
      controls.target.set(0, isMobile ? -0.8 : 1.5, 0);
    } else {
      if (isMobile) {
        camera.position.set(6.2, 2.8, 7.2);
        controls.target.set(0, -1.15, 0);
      } else {
        camera.position.set(5, 3, 6);
        controls.target.set(0, 0, 0);
      }
    }
    controls.update();
  }, [preset, camera, controlsRef, isMobile]);

  return null;
}

export default function ShowroomCanvas({ customModules, activeModelId, activeChassis, cameraPreset = 'iso' }) {
  const controlsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const { selectedVehicle } = useVehicleStore();
  
  const finalVehicleId = activeModelId || selectedVehicle;
  const isGiantVehicle = finalVehicleId === 'snvi-100-v8' || finalVehicleId === 'uk-double-decker';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className="w-full h-full absolute inset-0 z-0 touch-none"
      style={{ touchAction: 'none' }}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: isMobile ? [6.2, 2.8, 7.2] : [5, 3, 6], fov: isMobile ? 48 : 45 }}
        gl={{ antialias: false, preserveDrawingBuffer: false, powerPreference: "high-performance" }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>

          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={0.5}
            maxDistance={15}
            autoRotate={cameraPreset === 'iso'}
            autoRotateSpeed={0.5}
            target={isMobile ? [0, -1.15, 0] : [0, 0, 0]}
          />

          <CameraController preset={cameraPreset} controlsRef={controlsRef} isMobile={isMobile} />

          <Suspense fallback={null}>
            <EnvironmentLighting />
          </Suspense>

          {/* Shifted van further down (Y = -1.4m) on mobile viewports so roof clears CTA button */}
          <group 
            position={[0, isMobile ? -1.4 : 0, 0]} 
            scale={isGiantVehicle ? (isMobile ? 0.55 : 0.65) : (isMobile ? 0.88 : 1.0)}
          >
            <VehicleModel
              customModules={customModules}
              activeModelId={activeModelId}
              activeChassis={activeChassis}
            />
          </group>

          <ContactShadows
            frames={1}
            resolution={isMobile ? 256 : 512}
            scale={isGiantVehicle ? 20 : 15}
            blur={2}
            opacity={0.6}
            far={10}
            color="#181A1D"
            position={[0, isMobile ? -1.4 : 0, 0]}
          />

        </Suspense>
      </Canvas>
    </div>
  );
}
