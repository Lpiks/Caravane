import React from 'react';

export default function OverheadLockerShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Main Box */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Silver Cabinet Handles */}
      <mesh position={[-w/3, -h/4, d/2 + 0.01]}>
        <boxGeometry args={[0.2, 0.02, 0.02]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <mesh position={[w/3, -h/4, d/2 + 0.01]}>
        <boxGeometry args={[0.2, 0.02, 0.02]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
    </group>
  );
}
