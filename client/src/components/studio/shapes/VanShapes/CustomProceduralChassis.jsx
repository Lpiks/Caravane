import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from "@react-three/drei";
import { extend } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three-stdlib';

extend({ RoundedBoxGeometry });

const S = 0.01;

export default function CustomProceduralChassis({ chassis }) {
  const parts = chassis?.parts || [];

  return (
    <group>
      {parts.map(part => (
        <ProceduralPart key={part.id} part={part} />
      ))}
    </group>
  );
}

function ProceduralPart({ part }) {
  const scaledL = (part.size[0] || 0) * S;
  const scaledH = (part.size[2] || 0) * S;
  const scaledW = (part.size[1] || 0) * S;

  const offset = part.offset || [0, 0, 0];
  const rot = part.rotation || [0, 0, 0];

  const pos = [offset[0] * S, offset[1] * S + (scaledH / 2), offset[2] * S];
  const rotation = [
    rot[0] * (Math.PI / 180),
    rot[1] * (Math.PI / 180),
    rot[2] * (Math.PI / 180)
  ];

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

  if (part.shape === 'text') {
    return (
      <Text
        text={part.textString || 'Text'}
        font={part.fontUrl || undefined}
        fontSize={scaledL}
        color={part.color || '#ffffff'}
        position={pos}
        rotation={rotation}
        anchorX="center"
        anchorY="middle"
      >
        <meshStandardMaterial
          color={part.color || '#ffffff'}
          roughness={part.roughness !== undefined ? part.roughness : 0.7}
          metalness={part.metalness !== undefined ? part.metalness : 0.2}
        />
      </Text>
    );
  }

  return (
    <mesh position={pos} rotation={rotation} castShadow receiveShadow>
      {part.shape === 'box' && <boxGeometry args={[scaledL, scaledH, scaledW]} />}
      {part.shape === 'window' && <boxGeometry args={[scaledL, scaledH, scaledW]} />}
      {part.shape === 'cylinder' && <cylinderGeometry args={[scaledL / 2, scaledL / 2, scaledH, 32]} />}
      {part.shape === 'wheel' && <cylinderGeometry args={[scaledL / 2, scaledL / 2, scaledW, 32]} />}
      {part.shape === 'sphere' && <sphereGeometry args={[scaledL / 2, 32, 32]} />}
      {part.shape === 'wedge' && <primitive object={wedgeGeometry} attach="geometry" />}

      <meshStandardMaterial
        color={part.shape === 'window' ? (part.color || '#000000') : part.shape === 'wheel' ? '#1a1a1a' : (part.color || '#4b5563')}
        roughness={part.shape === 'window' ? (part.roughness !== undefined ? part.roughness : 0.1) : part.shape === 'wheel' ? 0.9 : (part.roughness !== undefined ? part.roughness : 0.7)}
        metalness={part.shape === 'window' ? (part.metalness !== undefined ? part.metalness : 0.9) : part.shape === 'wheel' ? 0.1 : (part.metalness !== undefined ? part.metalness : 0.2)}
        transparent={part.shape === 'window' ? true : (part.opacity !== undefined && part.opacity < 1)}
        opacity={part.shape === 'window' ? (part.opacity !== undefined ? part.opacity : 0.5) : (part.opacity !== undefined ? part.opacity : 1)}
      />
    </mesh>
  );
}
