'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import SafeEnvironment from './SafeEnvironment';
import * as THREE from 'three';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Settings, Maximize2, Layers, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

const S = 1 / 100; // Scale down from cm to meters

// Procedural part renderer using GSAP for exploded entry
const AnimatedPart = ({ part, index, isActive, parentPosition, parentRotation, parentH, globalMode, modStates }) => {
  const meshRef = useRef();
  const isFirstRender = useRef(true);

  const secondState = modStates?.find(s => s !== 'default') || 'open';
  const currentState = globalMode === 'action' ? secondState : 'default';
  const isVisible = !(part.visibleInStates && Array.isArray(part.visibleInStates) && part.visibleInStates.length > 0 && !part.visibleInStates.includes(currentState));

  const width = (part.size?.[0] || 0) * S;
  const height = (part.size?.[2] || 0) * S;
  const depth = (part.size?.[1] || 0) * S;

  const getArrayValue = (field) => {
    if (!part[field]) return [0, 0, 0];
    if (Array.isArray(part[field])) return part[field];
    if (typeof part[field] === 'object') {
      return part[field][currentState] || part[field]['default'] || [0, 0, 0];
    }
    return [0, 0, 0];
  };

  const currentOffset = getArrayValue('offset');
  const currentRotation = getArrayValue('rotation');

  const localX = currentOffset[0] * S;
  const localY = (currentOffset[1] * S) + (height / 2) - ((parentH * S) / 2);
  const localZ = currentOffset[2] * S;

  const targetX = localX;
  const targetY = localY;
  const targetZ = localZ;

  const wedgeGeometry = useMemo(() => {
    if (part.shape !== 'wedge') return null;
    const shape = new THREE.Shape();
    shape.moveTo(-0.5, -0.5);
    shape.lineTo(0.5, -0.5);
    shape.lineTo(-0.5, 0.5);
    shape.lineTo(-0.5, -0.5);
    const geom = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
    geom.center();
    geom.scale(width, height, depth);
    return geom;
  }, [part.shape, width, height, depth]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isActive) {
        meshRef.current.visible = false;
        meshRef.current.scale.set(0, 0, 0);
        return;
      }
    }

    const ctx = gsap.context(() => {
      if (isActive) {
        meshRef.current.visible = true;
        gsap.fromTo(meshRef.current.position,
          { y: targetY + 3 },
          { y: targetY, duration: 1.2, ease: "power3.out", delay: index * 0.15 + 0.3 }
        );
        gsap.fromTo(meshRef.current.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.5)", delay: index * 0.15 + 0.2 }
        );
      } else {
        gsap.to(meshRef.current.position, { y: targetY + 2, duration: 0.8, ease: "power2.in" });
        gsap.to(meshRef.current.scale, {
          x: 0, y: 0, z: 0,
          duration: 0.8,
          ease: "power2.in",
          onComplete: () => {
            if (meshRef.current && !isActive) meshRef.current.visible = false;
          }
        });
      }
    });
    return () => ctx.revert();
  }, [isActive, index, targetY, targetX, targetZ]);

  if (!isVisible) return null;

  return (
    <mesh
      ref={meshRef}
      position={[targetX, targetY, targetZ]}
      rotation={[
        THREE.MathUtils.degToRad(currentRotation[0]),
        THREE.MathUtils.degToRad(currentRotation[1]),
        THREE.MathUtils.degToRad(currentRotation[2])
      ]}
      castShadow
      receiveShadow
    >
      {part.shape === 'cylinder' ? (
        <cylinderGeometry args={[width / 2, width / 2, height, 32]} />
      ) : part.shape === 'wheel' ? (
        <cylinderGeometry args={[width / 2, width / 2, depth, 32]} />
      ) : part.shape === 'sphere' ? (
        <sphereGeometry args={[width / 2, 32, 32]} />
      ) : part.shape === 'wedge' && wedgeGeometry ? (
        <primitive object={wedgeGeometry} attach="geometry" />
      ) : (
        <boxGeometry args={[width, height, depth]} />
      )}
      <meshStandardMaterial
        color={part.shape === 'window' ? '#000000' : part.shape === 'wheel' ? '#1a1a1a' : (part.color || '#4b5563')}
        metalness={part.shape === 'window' ? 0.9 : part.shape === 'wheel' ? 0.1 : (part.metalness !== undefined ? part.metalness : 0.2)}
        roughness={part.shape === 'window' ? 0.1 : part.shape === 'wheel' ? 0.9 : (part.roughness !== undefined ? part.roughness : 0.7)}
        transparent={part.shape === 'window' ? true : (part.opacity !== undefined && part.opacity < 1)}
        opacity={part.shape === 'window' ? 0.5 : (part.opacity !== undefined ? part.opacity : 1)}
        envMapIntensity={1.5}
      />
    </mesh>
  );
};

// Scene Wrapper
const Scene = ({ activeIndex, templates, dbChassis, dbComponents, mode }) => {
  const turntableRef = useRef();
  const cameraRef = useRef();

  const getComponentParts = (typeId) => {
    const comp = dbComponents.find(c => c.id === typeId);
    return comp ? { parts: comp.parts, h: comp.defaultH, states: comp.states } : { parts: [], h: 0, states: ['default'] };
  };

  useFrame(() => {
    if (turntableRef.current) {
      turntableRef.current.rotation.y -= 0.003;
    }
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (turntableRef.current) {
      gsap.to(turntableRef.current.rotation, {
        y: turntableRef.current.rotation.y - Math.PI,
        duration: 1.5,
        ease: "power3.inOut"
      });
    }

    if (cameraRef.current) {
      const activeTemplate = templates[activeIndex];
      if (activeTemplate) {
        const chassisData = dbChassis.find(c => c.id === activeTemplate.chassisId);
        const lengthCm = chassisData ? (chassisData.defaultL || 300) : 300;

        const scale = Math.max(1, 1 + ((lengthCm - 400) / 600));
        const mobileMultiplier = isMobile ? 1.8 : 1.0;

        gsap.to(cameraRef.current.position, {
          x: 5 * scale * mobileMultiplier,
          y: (3 + (1.5 * scale)) * mobileMultiplier,
          z: 6 * scale * mobileMultiplier,
          duration: 1.5,
          ease: "power3.inOut"
        });
      }
    }
  }, [activeIndex, templates, dbChassis, isMobile]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={isMobile ? [9, 7.2, 10.8] : [5, 4, 6]} fov={45} />
      <OrbitControls target={[0, 0.5, 0]} enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2 - 0.05} />

      <fog attach="fog" args={['#0a0a0c', 15, 60]} />

      <ambientLight intensity={0.2} />
      <spotLight
        position={[0, 8, 0]}
        intensity={2}
        angle={0.6}
        penumbra={0.5}
        castShadow
        color="#ffffff"
      />
      <directionalLight position={[-5, 2, -5]} intensity={1.5} color="#60a5fa" />
      <pointLight position={[0, 4, 0]} intensity={1} color="#e0f2fe" distance={10} decay={2} />

      <SafeEnvironment preset="city" />

      <group ref={turntableRef}>
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <cylinderGeometry args={[3.2, 3.2, 0.1, 64]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[3.1, 3.1, 0.11, 64]} />
          <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.6} />
        </mesh>

        {templates.map((template, idx) => {
          const chassisData = dbChassis.find(c => c.id === template.chassisId);

          let cx = 0;
          let cz = 0;
          let fh = 0;
          if (chassisData) {
            cx = (chassisData.centerX || 0) * 0.01;
            cz = (chassisData.centerZ || 0) * 0.01;
            const floorPart = chassisData.parts?.find(p => p.name?.toLowerCase().includes('floor'));
            if (floorPart && floorPart.offset && floorPart.size) {
              fh = ((floorPart.offset[1] || 0) + (floorPart.size[2] || 0)) * 0.01;
            } else if (chassisData.floorHeight) {
              fh = chassisData.floorHeight * 0.01;
            }
          }

          return (
            <group key={template._id || template.id || idx} position={[0, fh, 0]}>
              <group position={[0, -fh, 0]} rotation={[0, 0, 0]}>
                <group position={[-cx, 0, -cz]}>
                  {chassisData && chassisData.parts.map((part, partIdx) => (
                    <AnimatedPart
                      key={`chassis-${part.id}`}
                      part={part}
                      index={partIdx * 0.5}
                      isActive={idx === activeIndex}
                      parentPosition={[0, 0, 0]}
                      parentH={0}
                      globalMode={idx === activeIndex ? mode : 'default'}
                      modStates={chassisData.states}
                    />
                  ))}
                </group>
              </group>

              {template.modules.map((mod, modIdx) => {
                const compData = getComponentParts(mod.typeId);
                if (!compData) return null;
                return (
                  <group key={`mod-${mod.id || modIdx}`} position={mod.position} rotation={[0, mod.rotation || 0, 0]}>
                    {compData.parts.map((part, partIdx) => (
                      <AnimatedPart
                        key={`${mod.typeId}-${part.id}`}
                        part={part}
                        index={modIdx + partIdx}
                        isActive={idx === activeIndex}
                        parentPosition={[0, 0, 0]}
                        parentRotation={0}
                        parentH={compData.h}
                        globalMode={idx === activeIndex ? mode : 'default'}
                        modStates={compData.states}
                      />
                    ))}
                  </group>
                );
              })}
            </group>
          );
        })}
      </group>

      <ContactShadows
        position={[0, -0.1, 0]}
        opacity={0.8}
        scale={10}
        blur={2}
        far={4}
        color="#000000"
      />

      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.15} />
      </mesh>
    </>
  );
};

export default function GarageShowroom() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState('default');
  const [templates, setTemplates] = useState([]);
  const [dbChassis, setDbChassis] = useState([]);
  const [dbComponents, setDbComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardOpen, setIsCardOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const [tplRes, chassisRes, compRes] = await Promise.all([
          axios.get(`${API_BASE}/api/templates`),
          axios.get(`${API_BASE}/api/chassis`),
          axios.get(`${API_BASE}/api/components`)
        ]);

        if (tplRes.data.length > 0) {
          setTemplates(tplRes.data);
        } else {
          setTemplates([]);
        }

        setDbChassis(chassisRes.data);
        setDbComponents(compRes.data);
      } catch (err) {
        console.error("Failed to load DB templates", err);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextTemplate = () => {
    setActiveIndex((prev) => (prev + 1) % templates.length);
    setMode('default');
  };

  const prevTemplate = () => {
    setActiveIndex((prev) => (prev === 0 ? templates.length - 1 : prev - 1));
    setMode('default');
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-[#0a0a0c] flex items-center justify-center text-sky-500">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const activeTemplate = templates[activeIndex] || templates[0];
  const activeChassisData = activeTemplate ? dbChassis.find(c => c.id === activeTemplate.chassisId) : null;
  const dimensionsStr = activeChassisData
    ? `${activeChassisData.defaultL || 0} x ${activeChassisData.defaultW || 0} x ${activeChassisData.defaultH || 0} cm`
    : (activeTemplate ? activeTemplate.dimensions : 'Unknown') || 'Unknown';

  const chassisName = activeChassisData
    ? activeChassisData.name
    : (activeTemplate ? activeTemplate.chassisName : 'Unknown Chassis') || 'Unknown Chassis';

  return (
    <div className="relative w-full h-full bg-[#0a0a0c] overflow-hidden group">
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene activeIndex={activeIndex} templates={templates} dbChassis={dbChassis} dbComponents={dbComponents} mode={mode} />
        </Suspense>
      </Canvas>

      {/* Glass UI Overlay - Shifted to Top-Left on Desktop */}
      <div className="absolute top-16 sm:top-28 left-3 sm:left-8 md:left-16 w-[70vw] max-w-[260px] sm:w-80 pointer-events-none z-10">
        <div className="backdrop-blur-xl bg-zinc-950/70 border border-white/10 p-3 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl pointer-events-auto transition-all duration-500 ease-in-out">
          <div className="flex items-start justify-between mb-2 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                <Settings className="text-sky-400" size={14} />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-sky-400 font-bold uppercase tracking-widest">Active Template</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">0{activeIndex + 1} / 0{templates.length}</p>
              </div>
            </div>
            {/* Toggle Button */}
            <button
              onClick={() => setIsCardOpen(!isCardOpen)}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              {isCardOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          <div className={`transition-all duration-500 overflow-hidden ${isCardOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <h2 className="text-base sm:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight truncate">
              {activeTemplate ? activeTemplate.name : "No Templates Available"}
            </h2>
            <p className="text-[10px] sm:text-sm text-slate-400 mb-2 sm:mb-8 font-medium">
              Pre-configured modular layout.
            </p>

            <div className="space-y-1.5 sm:space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5 sm:pb-3">
                <span className="text-[9px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">Chassis</span>
                <span className="text-[11px] sm:text-sm text-slate-200 font-medium truncate max-w-[120px]">{chassisName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5 sm:pb-3">
                <span className="text-[9px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">Dimensions</span>
                <span className="text-[10px] sm:text-sm text-slate-200 font-mono flex items-center gap-1 sm:gap-2">
                  <Maximize2 size={10} className="text-slate-500" />
                  {dimensionsStr}
                </span>
              </div>
              <div className="flex items-center justify-between pb-0.5 border-b border-white/5 pb-1.5 sm:pb-3">
                <span className="text-[9px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">Modules</span>
                <span className="text-[10px] sm:text-sm text-slate-200 font-mono flex items-center gap-1 sm:gap-2">
                  <Layers size={10} className="text-sky-500" />
                  {activeTemplate ? activeTemplate.modules.length : 0} Loaded
                </span>
              </div>
            </div>

            {activeTemplate && (
              <div className="mt-4 sm:mt-6 pointer-events-auto">
                <Link
                  href={`/studio?template=${activeTemplate._id || activeTemplate.id}`}
                  className="w-full py-2.5 sm:py-3 bg-terracotta text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white hover:text-obsidian transition-colors rounded flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg active:scale-95 transition-all text-center"
                >
                  Customize in Studio
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action / Default Toggle */}
      <div className="absolute bottom-48 sm:bottom-32 left-1/2 -translate-x-1/2 flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/15 z-10 pointer-events-auto shadow-2xl">
        <button 
          onClick={() => setMode('default')}
          className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${mode === 'default' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-300 hover:text-white'}`}
        >
          Driving Mode
        </button>
        <button 
          onClick={() => setMode('action')}
          className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${mode === 'action' ? 'bg-sky-500 text-sky-950 shadow-[0_0_15px_rgba(56,189,248,0.5)]' : 'text-slate-300 hover:text-white'}`}
        >
          Camping Mode
        </button>
      </div>

      {/* Navigation Arrows for Templates (Prev / Next Template) - Lifted to bottom-20 */}
      <div className="absolute bottom-28 sm:bottom-20 right-14 sm:right-24 md:right-28 flex items-center gap-2.5 sm:gap-4 z-10 pointer-events-auto">
        <button
          onClick={prevTemplate}
          className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 transition-all shadow-xl active:scale-95"
          title="Previous Template"
        >
          <ChevronLeft size={18} className="sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextTemplate}
          className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-500/40 flex items-center justify-center text-sky-400 hover:bg-sky-500 hover:text-sky-950 hover:scale-105 transition-all shadow-xl active:scale-95"
          title="Next Template"
        >
          <ChevronRight size={18} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Progress Bar (Bottom Center) - Lifted to bottom-24 */}
      <div className="absolute bottom-40 sm:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 pointer-events-none">
        <div className="flex gap-2">
          {templates.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-700 ease-in-out ${i === activeIndex
                ? 'w-8 sm:w-10 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]'
                : 'w-2.5 sm:w-3 bg-white/20'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0c] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />
    </div>
  );
}
