'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, TransformControls, Line, Text } from '@react-three/drei';
import { Suspense, useState, useRef, useEffect, useMemo } from 'react';
import SafeEnvironment from './SafeEnvironment';
import * as THREE from 'three';

// Scale factor for preview (cm to meters)
const S = 0.01;

function SmartGuides({ meshEl, parts, activePartId }) {
  const lineRefs = useRef([null, null, null]);

  useFrame(() => {
    if (!meshEl) return;

    lineRefs.current.forEach(ref => {
      if (ref) ref.visible = false;
    });

    const rawPos = meshEl.position;
    const snapThreshold = 0.005; // 5mm threshold for perfect matches

    let matchCount = 0;

    const activePart = parts.find(p => p.id === activePartId);
    if (!activePart) return;

    const actW = (activePart.size[0] || 0) * S;
    const actD = (activePart.size[1] || 0) * S;
    const actH = (activePart.size[2] || 0) * S;

    parts.forEach(p => {
      if (p.id === activePartId) return;

      const tarW = (p.size[0] || 0) * S;
      const tarD = (p.size[1] || 0) * S;
      const tarH = (p.size[2] || 0) * S;

      const targetX = (p.offset[0] || 0) * S;
      const targetY = (p.offset[1] || 0) * S + (tarH / 2);
      const targetZ = (p.offset[2] || 0) * S;

      const activePtsX = [rawPos.x, rawPos.x - actW / 2, rawPos.x + actW / 2];
      const targetPtsX = [targetX, targetX - tarW / 2, targetX + tarW / 2];

      const activePtsY = [rawPos.y, rawPos.y - actH / 2, rawPos.y + actH / 2];
      const targetPtsY = [targetY, targetY - tarH / 2, targetY + tarH / 2];

      const activePtsZ = [rawPos.z, rawPos.z - actD / 2, rawPos.z + actD / 2];
      const targetPtsZ = [targetZ, targetZ - tarD / 2, targetZ + tarD / 2];

      const checkSnap = (actPts, tarPts) => {
        for (let a of actPts) {
          for (let t of tarPts) {
            if (Math.abs(a - t) < snapThreshold) {
              return { match: true, lineCoord: t };
            }
          }
        }
        return { match: false };
      };

      const drawLine = (p1, p2) => {
        if (matchCount < 3 && lineRefs.current[matchCount]) {
          const line = lineRefs.current[matchCount];
          const distance = p1.distanceTo(p2);
          line.position.copy(p1).lerp(p2, 0.5);
          line.lookAt(p2);
          line.scale.set(1, 1, distance);
          line.visible = true;
          matchCount++;
        }
      };

      const snapX = checkSnap(activePtsX, targetPtsX);
      if (snapX.match) {
        drawLine(
          new THREE.Vector3(snapX.lineCoord, rawPos.y, rawPos.z),
          new THREE.Vector3(snapX.lineCoord, targetY, targetZ)
        );
      }

      const snapY = checkSnap(activePtsY, targetPtsY);
      if (snapY.match) {
        drawLine(
          new THREE.Vector3(rawPos.x, snapY.lineCoord, rawPos.z),
          new THREE.Vector3(targetX, snapY.lineCoord, targetZ)
        );
      }

      const snapZ = checkSnap(activePtsZ, targetPtsZ);
      if (snapZ.match) {
        drawLine(
          new THREE.Vector3(rawPos.x, rawPos.y, snapZ.lineCoord),
          new THREE.Vector3(targetX, targetY, snapZ.lineCoord)
        );
      }
    });
  });

  return (
    <group>
      {[0, 1, 2].map(i => (
        <mesh key={i} ref={(el) => (lineRefs.current[i] = el)} visible={false}>
          <boxGeometry args={[0.005, 0.005, 1]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function ProceduralPart({ part, parts, isActive, onSelect, onOffsetUpdate, onRotationUpdate, onOrbitToggle, onDuplicate, isShiftPressedRef, activeState = 'default', previewRegion = 'LHD' }) {
  const [meshEl, setMeshEl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Visibility will be checked after hooks

  const scaledL = (part.size[0] || 0) * S;
  const scaledH = (part.size[2] || 0) * S;
  const scaledW = (part.size[1] || 0) * S;

  const getArrayValue = (field, state) => {
    if (!part[field]) return [0, 0, 0];
    if (Array.isArray(part[field])) return part[field];
    if (typeof part[field] === 'object') {
      return part[field][state] || part[field]['default'] || [0, 0, 0];
    }
    return [0, 0, 0];
  };

  const currentOffset = getArrayValue('offset', activeState);
  const currentRotation = getArrayValue('rotation', activeState);

  const scaledOX = currentOffset[0] * S;
  const scaledOY = currentOffset[1] * S;
  const scaledOZ = currentOffset[2] * S;

  const finalOX = previewRegion === 'RHD' ? -scaledOX : scaledOX;
  const finalRotY = previewRegion === 'RHD' ? -currentRotation[1] : currentRotation[1];
  const finalRotZ = previewRegion === 'RHD' ? -currentRotation[2] : currentRotation[2];

  const initialPosition = [finalOX, scaledOY + (scaledH / 2), scaledOZ];

  const initialRotation = [
    THREE.MathUtils.degToRad(currentRotation[0]),
    THREE.MathUtils.degToRad(finalRotY),
    THREE.MathUtils.degToRad(finalRotZ),
  ];

  const [transformMode, setTransformMode] = useState('translate');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'r') setTransformMode('rotate');
      if (e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'g') setTransformMode('translate');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (meshEl && !isDragging) {
      meshEl.position.set(...initialPosition);
      meshEl.rotation.set(...initialRotation);
    }
  }, [currentOffset.join(','), currentRotation.join(','), part.size.join(','), isDragging, meshEl]);

  const wedgeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.5, -0.5);
    shape.lineTo(0.5, -0.5);
    shape.lineTo(-0.5, 0.5);
    shape.lineTo(-0.5, -0.5);
    const extrudeSettings = { depth: 1, bevelEnabled: false };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    geom.scale(scaledL, scaledH, scaledW);
    return geom;
  }, [scaledL, scaledH, scaledW]);

  const isVisible = !(part.visibleInStates && Array.isArray(part.visibleInStates) && part.visibleInStates.length > 0 && !part.visibleInStates.includes(activeState));

  if (!isVisible) return null;

  const isText = part.shape === 'text';

  const content = isText ? (
    <Text
      ref={setMeshEl}
      text={part.textString || 'Text'}
      font={part.fontUrl || undefined} // Let troika fallback if undefined
      fontSize={scaledL} // Use X dimension as font size
      color={part.color || '#ffffff'}
      position={initialPosition}
      rotation={initialRotation}
      anchorX="center"
      anchorY="middle"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(part.id);
      }}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={part.color || '#ffffff'}
        emissive={isActive ? '#3b82f6' : '#000000'}
        emissiveIntensity={isActive ? 0.3 : 0}
        roughness={part.roughness !== undefined ? part.roughness : 0.7}
        metalness={part.metalness !== undefined ? part.metalness : 0.2}
      />
    </Text>
  ) : (
    <mesh
      ref={setMeshEl}
      castShadow
      receiveShadow
      position={initialPosition}
      rotation={initialRotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(part.id);
      }}
    >
      {part.shape === 'box' && <boxGeometry args={[scaledL, scaledH, scaledW]} />}
      {part.shape === 'window' && <boxGeometry args={[scaledL, scaledH, scaledW]} />}
      {part.shape === 'cylinder' && <cylinderGeometry args={[scaledL / 2, scaledL / 2, scaledH, 32]} />}
      {part.shape === 'wheel' && <cylinderGeometry args={[scaledL / 2, scaledL / 2, scaledW, 32]} />}
      {part.shape === 'sphere' && <sphereGeometry args={[scaledL / 2, 32, 32]} />}
      {part.shape === 'wedge' && <primitive object={wedgeGeometry} attach="geometry" />}

      <meshStandardMaterial
        color={part.shape === 'window' ? '#000000' : part.shape === 'wheel' ? '#1a1a1a' : (part.color || '#4b5563')}
        emissive={isActive ? '#3b82f6' : '#000000'}
        emissiveIntensity={isActive ? 0.3 : 0}
        roughness={part.shape === 'window' ? 0.1 : part.shape === 'wheel' ? 0.9 : (part.roughness !== undefined ? part.roughness : 0.7)}
        metalness={part.shape === 'window' ? 0.9 : part.shape === 'wheel' ? 0.1 : (part.metalness !== undefined ? part.metalness : 0.2)}
        transparent={part.shape === 'window' ? true : (part.opacity !== undefined && part.opacity < 1)}
        opacity={part.shape === 'window' ? 0.5 : (part.opacity !== undefined ? part.opacity : 1)}
      />
    </mesh>
  );

  if (isActive) {
    return (
      <>
        <SmartGuides
          meshEl={meshEl}
          parts={parts}
          activePartId={part.id}
        />

        {meshEl && (
          <TransformControls
            object={meshEl}
            mode={transformMode}
            translationSnap={S}
            rotationSnap={THREE.MathUtils.degToRad(5)}
            onMouseUp={() => {
              if (transformMode === 'translate') {
                const pos = meshEl.position;
                const newX = Math.round(pos.x / S);
                const newY = Math.round((pos.y - (scaledH / 2)) / S);
                const newZ = Math.round(pos.z / S);
                if (onOffsetUpdate) onOffsetUpdate(part.id, [newX, newY, newZ]);
              } else if (transformMode === 'rotate') {
                const rot = meshEl.rotation;
                const newRX = Math.round(THREE.MathUtils.radToDeg(rot.x));
                const newRY = Math.round(THREE.MathUtils.radToDeg(rot.y));
                const newRZ = Math.round(THREE.MathUtils.radToDeg(rot.z));
                if (onRotationUpdate) onRotationUpdate(part.id, [newRX, newRY, newRZ]);
                setTransformMode('translate');
              }
            }}
            onMouseDown={() => {
              if (isShiftPressedRef && isShiftPressedRef.current && onDuplicate) {
                // Instantly duplicate when clicking the transform arrow while holding Shift
                onDuplicate(part.id, false);
              }
            }}
            onDraggingChanged={(e) => {
              const isDrag = typeof e === 'boolean' ? e : (e && e.value !== undefined ? e.value : false);
              if (onOrbitToggle) onOrbitToggle(!isDrag);
              setIsDragging(isDrag);
            }}
          />
        )}
        {content}
      </>
    );
  }

  return content;
}

export default function ComponentPreviewCanvas({ 
  parts = [], 
  activePartId, 
  onSelectPart,
  onOffsetUpdate,
  onRotationUpdate,
  onOrbitToggle,
  onDuplicate,
  activeState = 'default',
  previewRegion = 'LHD'
}) {
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const isShiftPressedRef = useRef(false);

  useEffect(() => {
    const handlePointerEvent = (e) => {
      if (e.shiftKey !== undefined) {
        isShiftPressedRef.current = e.shiftKey;
      }
    };
    const handleKeyEvent = (e) => {
      if (e.key === 'Shift') {
        isShiftPressedRef.current = e.type === 'keydown';
      }
    };
    
    window.addEventListener('pointermove', handlePointerEvent, { capture: true });
    window.addEventListener('pointerdown', handlePointerEvent, { capture: true });
    window.addEventListener('pointerup', handlePointerEvent, { capture: true });
    
    window.addEventListener('keydown', handleKeyEvent, { capture: true });
    window.addEventListener('keyup', handleKeyEvent, { capture: true });
    
    return () => {
      window.removeEventListener('pointermove', handlePointerEvent, { capture: true });
      window.removeEventListener('pointerdown', handlePointerEvent, { capture: true });
      window.removeEventListener('pointerup', handlePointerEvent, { capture: true });
      window.removeEventListener('keydown', handleKeyEvent, { capture: true });
      window.removeEventListener('keyup', handleKeyEvent, { capture: true });
    };
  }, []);

  const cameraTarget = useMemo(() => {
    if (!activePartId) return [0, 0, 0];
    const activePart = parts.find(p => p.id === activePartId);
    if (!activePart) return [0, 0, 0];

    const getVal = (field) => {
      if (!activePart[field]) return [0, 0, 0];
      if (Array.isArray(activePart[field])) return activePart[field];
      if (typeof activePart[field] === 'object') {
        return activePart[field][activeState] || activePart[field]['default'] || [0, 0, 0];
      }
      return [0, 0, 0];
    };

    const offset = getVal('offset');
    const scaledH = (activePart.size && activePart.size[2] ? activePart.size[2] : 0) * S;

    const scaledOX = (offset[0] || 0) * S;
    const finalOX = previewRegion === 'RHD' ? -scaledOX : scaledOX;
    const scaledOY = (offset[1] || 0) * S;
    const scaledOZ = (offset[2] || 0) * S;

    return [finalOX, scaledOY + (scaledH / 2), scaledOZ];
  }, [activePartId, parts, activeState, previewRegion]);

  const maxL = useMemo(() => {
    let maxVal = 600;
    parts.forEach(p => {
      if (p.id === 'floor' || p.id === 'floor-1') {
        maxVal = Math.max(maxVal, p.size[0] || 0);
      }
    });
    return maxVal;
  }, [parts]);

  return (
    <div className="w-full h-full bg-[#0B0C10] relative rounded-xl overflow-hidden border border-white/5">
      <Canvas shadows camera={{ position: [2, 2, 2], fov: 50 }} onPointerMissed={() => onSelectPart(null)}>
        <Suspense fallback={null}>
          <SafeEnvironment preset="city" />
          <ambientLight intensity={0.4} />
          <directionalLight castShadow position={[5, 5, 5]} intensity={1} shadow-bias={-0.0001} />
          <CameraAdjuster maxL={maxL} />
          <group position={[0, -0.5, 0]}>
            {parts.map(part => (
              <ProceduralPart
                key={part.id}
                part={part}
                parts={parts}
                isActive={part.id === activePartId}
                onSelect={onSelectPart}
                onOffsetUpdate={onOffsetUpdate}
                onRotationUpdate={onRotationUpdate}
                onOrbitToggle={setOrbitEnabled}
                onDuplicate={onDuplicate}
                isShiftPressedRef={isShiftPressedRef}
                activeState={activeState}
                previewRegion={previewRegion}
              />
            ))}

            <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={Math.max(10, maxL * S * 1.3)} blur={2} far={4} />
            <gridHelper args={[Math.max(12, Math.ceil(maxL * S * 1.4)), 100, '#ffffff', '#ffffff']} position={[0, 0, 0]} material-opacity={0.05} material-transparent />
          </group>

          <OrbitControls makeDefault enabled={orbitEnabled} target={cameraTarget} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 text-xs text-white/30 pointer-events-none font-mono">
        Drag to orbit • Scroll to zoom • Press 'R' to Rotate • 'T' to Move
      </div>
    </div>
  );
}

function CameraAdjuster({ maxL }) {
  const { camera } = useThree();
  useEffect(() => {
    const factor = maxL * S;
    camera.position.set(factor * 0.9, factor * 0.7, factor * 0.9);
    camera.lookAt(0, 0, 0);
  }, [maxL, camera]);
  return null;
}
