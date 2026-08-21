import React from 'react';

export default function KitchenGalleyShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Base Cabinet */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Countertop */}
      <mesh position={[0, h/2 + 0.02, 0]}>
        <boxGeometry args={[w, 0.04, d + 0.02]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Simple recessed sink basin */}
      <mesh position={[w/4, h/2 + 0.02, 0]}>
        <boxGeometry args={[0.3, 0.045, 0.3]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
