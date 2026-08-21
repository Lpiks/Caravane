import React from 'react';

export default function CooktopShape({ w, h, d, color }) {
  return (
    <group>
      {/* Glass Base */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Left Burner */}
      <mesh position={[-w/4, h/2 + 0.005, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.06, 0.08, 16]} />
        <meshBasicMaterial color="#64748B" />
      </mesh>
      {/* Right Burner */}
      <mesh position={[w/4, h/2 + 0.005, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.04, 0.06, 16]} />
        <meshBasicMaterial color="#64748B" />
      </mesh>
    </group>
  );
}
