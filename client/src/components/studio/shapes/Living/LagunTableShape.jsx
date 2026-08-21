import React from 'react';

export default function LagunTableShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Metal Post Base */}
      <mesh position={[-w/2 + 0.1, -h/2 + 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      {/* Swivel Arm */}
      <mesh position={[-w/4, 0, 0]}>
        <boxGeometry args={[w/2, 0.04, 0.08]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      {/* Wooden Tabletop */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[w, 0.04, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.3} />
      </mesh>
    </group>
  );
}
