import React from 'react';

export default function ShowerCabinShape({ w, h, d, color }) {
  return (
    <group>
      {/* Shower Pan Base */}
      <mesh position={[0, -h/2 + 0.05, 0]}>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Frosted Glass Walls */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={true} opacity={0.4} roughness={0.4} />
      </mesh>
      {/* Shower Head */}
      <mesh position={[0, h/2 - 0.2, -d/2 + 0.1]} rotation={[Math.PI/4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.9} />
      </mesh>
    </group>
  );
}
