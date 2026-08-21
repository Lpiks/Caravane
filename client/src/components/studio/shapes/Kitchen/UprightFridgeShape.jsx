import React from 'react';

export default function UprightFridgeShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Main Body */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#374151" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Silver Door */}
      <mesh position={[0, 0, d/2 + 0.02]}>
        <boxGeometry args={[w - 0.04, h - 0.08, 0.04]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Door Handle */}
      <mesh position={[-w/2 + 0.1, 0.2, d/2 + 0.05]}>
        <boxGeometry args={[0.02, 0.3, 0.02]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.9} />
      </mesh>
      {/* Bottom Compressor Vent */}
      <mesh position={[0, -h/2 + 0.05, d/2 + 0.01]}>
        <boxGeometry args={[w - 0.04, 0.08, 0.01]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}
